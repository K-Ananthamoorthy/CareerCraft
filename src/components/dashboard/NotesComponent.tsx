'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Loader2 } from 'lucide-react'
import { Trash2 } from 'lucide-react'

interface NotesComponentProps {
  userId: string
}

export function NotesComponent({ userId }: NotesComponentProps) {
  const [note, setNote] = useState('')  // Stores the current note text being written
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notesList, setNotesList] = useState<string[]>([])  // List of saved notes (point-wise)
  const [completedNotes, setCompletedNotes] = useState<Set<number>>(new Set())  // Track completed notes
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (userId) {
      fetchNotes()
    }
  }, [userId])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('notes')
        .select('content')
        .eq('user_id', userId)

      if (error) throw error
      if (data) {
        // Split the content into individual notes (point-wise)
        setNotesList(data.map((note) => note.content))
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveNote = async () => {
    try {
      setSaving(true)
      const newNotesList = [...notesList, note]  // Add the new note to the list

      const { error } = await supabase
        .from('notes')
        .upsert({ user_id: userId, content: note })

      if (error) throw error
      setNotesList(newNotesList)  // Update the state with the new list
      setNote('')  // Clear the text area after saving
      console.log('Note saved successfully')
    } catch (error) {
      console.error('Error saving note:', error)
    } finally {
      setSaving(false)
    }
  }

  const deleteNote = async (index: number) => {
    try {
      const noteToDelete = notesList[index]
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('user_id', userId)
        .eq('content', noteToDelete)

      if (error) throw error

      // Remove the note from the state after deletion
      const updatedNotesList = notesList.filter((_, i) => i !== index)
      setNotesList(updatedNotesList)
      console.log('Note deleted successfully')
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const toggleCompletion = (index: number) => {
    const updatedCompletedNotes = new Set(completedNotes)
    if (updatedCompletedNotes.has(index)) {
      updatedCompletedNotes.delete(index)
    } else {
      updatedCompletedNotes.add(index)
    }
    setCompletedNotes(updatedCompletedNotes)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[150px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl p-4 mx-auto space-y-6">
      {/* Card for writing new note */}
      <div className="p-6 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Write a New Task</h2>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your task here..."
          className="w-full min-h-[150px] border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <Button
          onClick={saveNote}
          className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
          disabled={saving}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {saving ? 'Saving...' : 'Save Task'}
        </Button>
      </div>

      {/* Display saved tasks */}
      <div className="space-y-4">
        {notesList.length > 0 ? (
          notesList.map((savedNote, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
                completedNotes.has(index) ? 'bg-green-100' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={completedNotes.has(index)}
                    onChange={() => toggleCompletion(index)}
                    className="w-5 h-5 text-green-600 form-checkbox"
                  />
                  <p className={`text-lg ${completedNotes.has(index) ? 'line-through' : ''}`}>
                    {savedNote}
                  </p>
                </div>
                <Button
                  onClick={() => deleteNote(index)}
                  className="text-red-600 hover:text-red-800"
                  variant="ghost"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No tasks saved yet</div>
        )}
      </div>
    </div>
  )
}
