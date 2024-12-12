"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export default function EssayGradingTool() {
  const [essay, setEssay] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!essay.trim() || !subject.trim()) {
      toast({ title: "Error", description: "Please enter both the essay and the subject.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI essay grader specialized in grading essays for engineering students in India. 
        Grade the following essay on the subject of "${subject}" out of 100 points. 
        Provide a detailed analysis considering the following aspects:
        1. Technical accuracy and depth of knowledge
        2. Clarity of expression and logical flow
        3. Relevance to Indian engineering context
        4. Use of examples and case studies
        5. Critical thinking and problem-solving approach
        6. Grammar, syntax, and technical writing skills

        Format your response as follows:
        Grade: [numerical grade]
        Overall Feedback: [2-3 sentences of general feedback]
        Strengths:
        - [Point 1]
        - [Point 2]
        - [Point 3]
        Areas for Improvement:
        - [Point 1]
        - [Point 2]
        - [Point 3]
        Technical Accuracy: [Comments on technical content]
        Relevance to Indian Engineering: [How well the essay relates to the Indian context]
        Writing Style: [Comments on clarity, structure, and technical writing]
        Recommendations: [Specific suggestions for improvement]
        
        Essay Subject: ${subject}
        Essay: ${essay}
      `);
      const response = await result.response;
      setGrade(response.text());
    } catch (error) {
      console.error("Error grading essay:", error);
      toast({ title: "Error", description: "An error occurred while grading the essay. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="subject">Essay Subject:</Label>
          <input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Machine Learning in IoT, Sustainable Engineering Practices..."
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <Label htmlFor="essay">Enter your essay:</Label>
          <Textarea
            id="essay"
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            placeholder="Paste your essay here..."
            className="mb-4"
            rows={10}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Grade Essay
        </Button>
      </form>
      {grade && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">Essay Feedback:</h3>
          <div className="whitespace-pre-wrap">{grade}</div>
        </div>
      )}
    </div>
  )
}

