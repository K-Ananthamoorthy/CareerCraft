"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'

interface Event {
  id: string
  title: string
  date: Date
  user_id: string
}

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState({ title: '', date: new Date() })
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from('student_events')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      setEvents(data.map(event => ({ ...event, date: new Date(event.date) })))
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddEvent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from('student_events')
        .insert([
          { title: newEvent.title, date: newEvent.date.toISOString(), user_id: user.id }
        ])
        .select()

      if (error) throw error

      setEvents([...events, { ...data[0], date: new Date(data[0].date) }])
      setNewEvent({ title: '', date: new Date() })
      toast({
        title: "Success",
        description: "Event added successfully.",
      })
    } catch (error) {
      console.error('Error adding event:', error)
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border rounded-md"
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Add New Event</h3>
              <div className="space-y-2">
                <Label htmlFor="event-title">Event Title</Label>
                <Input
                  id="event-title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div className="mt-2 space-y-2">
                <Label htmlFor="event-date">Event Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date.toISOString().split('T')[0]}
                  onChange={(e) => setNewEvent({ ...newEvent, date: new Date(e.target.value) })}
                />
              </div>
              <Button onClick={handleAddEvent} className="mt-2">Add Event</Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upcoming Events</h3>
              <ul className="space-y-2">
                {events
                  .filter(event => event.date >= new Date())
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .slice(0, 5)
                  .map(event => (
                    <li key={event.id} className="flex items-center justify-between">
                      <span>{event.title}</span>
                      <span className="text-sm text-gray-500">
                        {event.date.toLocaleDateString()}
                      </span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

