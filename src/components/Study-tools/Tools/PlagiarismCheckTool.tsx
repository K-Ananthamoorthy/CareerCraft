"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export default function PlagiarismCheckTool() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter text to check for plagiarism.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI plagiarism checker specialized in analyzing text for engineering students in India.
        Analyze the following text for potential plagiarism, considering common sources in Indian engineering education.
        Provide a detailed report on the likelihood of plagiarism, mentioning any suspicious patterns or content.
        Consider the following aspects:
        1. Similarity to common textbooks and resources used in Indian engineering programs
        2. Presence of technical jargon or explanations that seem too advanced for the typical student level
        3. Inconsistencies in writing style or sudden changes in language complexity
        4. Presence of region-specific examples or case studies that might be copied from local sources

        Format your response as follows:
        Plagiarism Likelihood: [percentage estimate]
        Analysis: [2-3 sentences explaining the overall analysis]
        Suspicious Elements:
        - [Point 1]
        - [Point 2]
        - [Point 3]
        Potential Sources: [List any suspected sources, if applicable]
        Recommendations:
        - [Suggestion 1 for improving originality]
        - [Suggestion 2 for improving originality]
        - [Suggestion 3 for improving originality]

        Text to analyze: ${text}
      `);
      const response = await result.response;
      setResult(response.text());
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast({ title: "Error", description: "An error occurred while checking for plagiarism. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <Label htmlFor="plagiarism-text">Enter text to check for plagiarism:</Label>
        <Textarea
          id="plagiarism-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to check for plagiarism..."
          className="mb-4"
          rows={10}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Check Plagiarism
        </Button>
      </form>
      {result && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">Plagiarism Check Result:</h3>
          <div className="whitespace-pre-wrap">{result}</div>
        </div>
      )}
    </div>
  )
}

