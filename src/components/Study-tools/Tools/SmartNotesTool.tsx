"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface Note {
  id: string;
  subject: string;
  content: string;
  summary: string;
  createdAt: Date;
}

export default function EnhancedSmartNotesTool() {
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedNotes = localStorage.getItem('smartNotes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('smartNotes', JSON.stringify(notes))
  }, [notes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !subject.trim()) {
      toast({ title: "Error", description: "Please enter both notes and subject.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI note summarizer specialized in creating smart notes for students.
        Summarize the following notes on the subject of "${subject}", highlighting key points and concepts.
        Consider the following aspects:
        1. Technical accuracy and relevance to the subject
        2. Key formulas, equations, or principles
        3. Practical applications
        4. Connections to other related concepts
        5. Potential exam focus areas or important topics

        Format your response as follows:
        Subject: ${subject}
        Key Concepts:
        1. [Concept 1]
        2. [Concept 2]
        3. [Concept 3]
        
        Detailed Summary:
        [Provide a concise yet comprehensive summary of the notes]
        
        Important Formulas/Equations:
        - [Formula 1]
        - [Formula 2]
        - [Formula 3]
        
        Practical Applications:
        - [Application 1]
        - [Application 2]
        - [Application 3]
        
        Related Concepts:
        - [Related Concept 1]
        - [Related Concept 2]
        - [Related Concept 3]
        
        Exam Focus Areas:
        - [Focus Area 1]
        - [Focus Area 2]
        - [Focus Area 3]
        
        Additional Resources:
        - [Recommended textbook or online resource 1]
        - [Recommended textbook or online resource 2]

        Notes: ${content}
      `);
      const response = await result.response;
      const generatedSummary = response.text();
      setSummary(generatedSummary);

      const newNote: Note = {
        id: Date.now().toString(),
        subject,
        content,
        summary: generatedSummary,
        createdAt: new Date(),
      }

      setNotes(prevNotes => [...prevNotes, newNote])
      setCurrentNote(newNote)
      toast({ title: "Success", description: "Smart notes generated and saved successfully.", variant: "default" })
    } catch (error) {
      console.error("Error summarizing notes:", error);
      toast({ title: "Error", description: "An error occurred while summarizing the notes. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNote = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
    if (currentNote?.id === id) {
      setCurrentNote(null)
      setSubject('')
      setContent('')
      setSummary('')
    }
    toast({ title: "Success", description: "Note deleted successfully.", variant: "default" })
  }

  const handleEditNote = (note: Note) => {
    setCurrentNote(note)
    setSubject(note.subject)
    setContent(note.content)
    setSummary(note.summary)
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Enhanced Smart Notes Tool</h1>
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Notes</TabsTrigger>
          <TabsTrigger value="manage">Manage Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Smart Notes</CardTitle>
              <CardDescription>Enter your notes and generate a smart summary</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject:</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Digital Signal Processing, Machine Design, etc."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Enter your notes:</Label>
                  <Textarea
                    id="notes"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter your notes here..."
                    className="mb-4"
                    rows={10}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Generate Smart Summary
                </Button>
              </form>
            </CardContent>
          </Card>
          {summary && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>AI-Generated Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{summary}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Notes</CardTitle>
              <CardDescription>View, edit, and delete your saved notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map(note => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle>{note.subject}</CardTitle>
                      <CardDescription>{new Date(note.createdAt).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 truncate">{note.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => handleEditNote(note)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteNote(note.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

