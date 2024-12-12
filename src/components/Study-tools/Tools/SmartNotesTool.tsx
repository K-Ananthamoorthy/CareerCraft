"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export default function SmartNotesTool() {
  const [notes, setNotes] = useState('')
  const [subject, setSubject] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes.trim() || !subject.trim()) {
      toast({ title: "Error", description: "Please enter both notes and subject.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI note summarizer specialized in creating smart notes for engineering students in India.
        Summarize the following notes on the subject of "${subject}", highlighting key points and concepts relevant to Indian engineering education.
        Consider the following aspects:
        1. Technical accuracy and relevance to the Indian engineering curriculum
        2. Key formulas, equations, or principles
        3. Applications in the Indian industrial context
        4. Connections to other related engineering concepts
        5. Potential exam focus areas or important topics for Indian engineering exams

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
        
        Applications in Indian Industry:
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

        Notes: ${notes}
      `);
      const response = await result.response;
      setSummary(response.text());
    } catch (error) {
      console.error("Error summarizing notes:", error);
      toast({ title: "Error", description: "An error occurred while summarizing the notes. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
      {summary && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">AI-Generated Summary:</h3>
          <div className="whitespace-pre-wrap">{summary}</div>
        </div>
      )}
    </div>
  )
}

