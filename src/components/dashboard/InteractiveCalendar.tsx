"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronLeft, ChevronRight, Plus, X, CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Note {
  id: string;
  date: string;
  content: string;
  time?: string;
}

interface InteractiveCalendarProps {
  userId: string;
}

export default function InteractiveCalendar({ userId }: InteractiveCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [newNoteTime, setNewNoteTime] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  async function fetchNotes() {
    const { data, error } = await supabase
      .from('calendar_notes')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
  }

  async function addNote() {
    if (!selectedDate || !newNote.trim()) return;

    const { data, error } = await supabase
      .from('calendar_notes')
      .insert({
        user_id: userId,
        date: selectedDate.toISOString().split('T')[0],
        content: newNote.trim(),
        time: newNoteTime
      })
      .select();

    if (error) {
      console.error('Error adding note:', error);
    } else if (data) {
      setNotes([...notes, data[0]]);
      setNewNote('');
      setNewNoteTime('');
      setIsAddingNote(false);
    }
  }

  async function deleteNote(noteId: string) {
    const { error } = await supabase
      .from('calendar_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting note:', error);
    } else {
      setNotes(notes.filter(note => note.id !== noteId));
    }
  }

  function getDayNotes(day: Date) {
    return notes.filter(note => note.date === day.toISOString().split('T')[0]);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl sm:text-2xl">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="w-full md:w-1/2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="border rounded-md"
              components={{
                Day: ({ date, ...props }) => {
                  const dayNotes = getDayNotes(date);
                  return (
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`relative flex items-center justify-center p-2 cursor-pointer ${
                        dayNotes.length > 0 ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      {...props}
                    >
                      {format(date, 'd')}
                      {dayNotes.length > 0 && (
                        <span className="absolute w-2 h-2 rounded-full bottom-1 right-1 bg-secondary" />
                      )}
                    </motion.div>
                  );
                },
              }}
            />
          </div>
          <div className="w-full md:w-1/2">
            <h3 className="mb-2 text-lg font-semibold">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            <AnimatePresence>
              {getDayNotes(selectedDate || new Date()).map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start justify-between p-3 mb-2 rounded-md bg-muted"
                >
                  <div>
                    <p>{note.content}</p>
                    {note.time && (
                      <p className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {note.time}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteNote(note.id)}
                    className="w-6 h-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {selectedDate && (
              <div className="mt-4">
                {isAddingNote ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Input
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a new note..."
                      className="mb-2"
                    />
                    <Input
                      type="time"
                      value={newNoteTime}
                      onChange={(e) => setNewNoteTime(e.target.value)}
                      className="mb-2"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button onClick={() => setIsAddingNote(false)} variant="outline">Cancel</Button>
                      <Button onClick={addNote}>Add Note</Button>
                    </div>
                  </motion.div>
                ) : (
                  <Button onClick={() => setIsAddingNote(true)} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Note
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

