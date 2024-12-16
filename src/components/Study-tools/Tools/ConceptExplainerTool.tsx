"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, BookOpen, Lightbulb, Compass, Save, Send } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { marked } from 'marked'
import React from 'react'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface SavedExplanation {
  id: string;
  concept: string;
  content: string;
  timestamp: number;
  mode: string;
}

export default function ConceptExplainerTool() {
  const [concept, setConcept] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [savedExplanations, setSavedExplanations] = useState<SavedExplanation[]>([])
  const [mode, setMode] = useState('informative')

  useEffect(() => {
    const saved = localStorage.getItem('savedExplanations')
    if (saved) {
      setSavedExplanations(JSON.parse(saved))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!concept.trim()) {
      toast({ title: "Error", description: "Please enter a concept to explain.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI concept explainer specializing in engineering concepts, designed to assist students in India. Your goal is to provide a detailed, engaging, and contextually relevant explanation of the given concept, while maintaining clarity and simplicity. The explanation should be tailored to align with Indian engineering education. Avoid unnecessary jargon and ensure your response is approachable for students at undergraduate and postgraduate levels.
      
        The concept to explain is: **${concept}**
        
        Explanation mode: ${mode}

        ${getPromptForMode(mode)}
      
        Your explanation should cover the following aspects:
        1. Definition and basic understanding
        2. Key components or principles
        3. Real-world applications, especially in an Indian context
        4. Historical context and any Indian contributions
        5. Relevance to Indian engineering curriculum
        6. Recent advancements or research in India related to this concept

        Format your response in a conversational and engaging style, as if you're a knowledgeable and enthusiastic tutor. Use the following techniques to keep the user engaged:

        1. Start with a hook or interesting fact related to the concept.
        2. Use analogies or metaphors to explain complex ideas.
        3. Include rhetorical questions to encourage critical thinking.
        4. Break down the explanation into clear, digestible paragraphs.
        5. Use bullet points or numbered lists for key points or steps.
        6. Incorporate emojis sparingly to add visual interest (e.g., 💡 for ideas, 🔬 for experiments).
        7. End with a thought-provoking question or a call to action for further exploration.

        Use Markdown formatting to enhance readability:
        - Use ## for main section headings
        - Use ### for subsection headings
        - Use **bold** for emphasis on important terms
        - Use \`code blocks\` for any mathematical formulas or short code snippets
        - Use > for quotes or important notes

        Begin your explanation now.
      `);
      
      const response = await result.response;
      const content = response.text();
      
      setExplanation(content);
    } catch (error) {
      console.error("Error explaining concept:", error);
      toast({ title: "Error", description: "An error occurred while explaining the concept. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (!explanation) {
      toast({ title: "Error", description: "No explanation to save.", variant: "destructive" })
      return
    }
    const newSavedExplanation: SavedExplanation = {
      id: `${concept.toLowerCase().replace(/\s+/g, '-')}-${mode}-${Date.now()}`,
      concept,
      content: explanation,
      timestamp: Date.now(),
      mode
    }
    const updatedSavedExplanations = [...savedExplanations, newSavedExplanation]
    setSavedExplanations(updatedSavedExplanations)
    localStorage.setItem('savedExplanations', JSON.stringify(updatedSavedExplanations))
    toast({ title: "Success", description: "Explanation saved successfully.", variant: "default" })
  }

  const getPromptForMode = (selectedMode: string) => {
    switch (selectedMode) {
      case 'informative':
        return 'Provide a detailed and informative explanation with a focus on accuracy and depth.';
      case 'fun':
        return 'Explain the concept in a fun and creative way, using analogies, metaphors, and engaging examples while maintaining accuracy.';
      case 'general':
        return 'Give a general overview of the concept, suitable for a broad audience with varying levels of technical knowledge.';
      default:
        return 'Provide a balanced explanation suitable for engineering students.';
    }
  }

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-6 rounded-lg shadow-lg sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-indigo-700">Concept Explainer</CardTitle>
          <CardDescription>Understand engineering concepts with ease</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="concept" className="text-lg font-medium text-gray-700">Enter an engineering concept:</Label>
              <Input
                id="concept"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="e.g., Fourier Transform, Finite Element Analysis, VLSI Design..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                type="button"
                variant={mode === 'informative' ? 'default' : 'outline'}
                onClick={() => setMode('informative')}
                className="justify-center flex-1"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Informative
              </Button>
              <Button
                type="button"
                variant={mode === 'fun' ? 'default' : 'outline'}
                onClick={() => setMode('fun')}
                className="justify-center flex-1"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Fun/Creative
              </Button>
              <Button
                type="button"
                variant={mode === 'general' ? 'default' : 'outline'}
                onClick={() => setMode('general')}
                className="justify-center flex-1"
              >
                <Compass className="w-4 h-4 mr-2" />
                General
              </Button>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              {isLoading ? 'Explaining...' : 'Explain Concept'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {explanation && (
        <Card className="mt-6 bg-white">
          <CardHeader className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
            <CardTitle className="text-xl font-bold text-indigo-700">{concept}</CardTitle>
            <Button onClick={handleSave} variant="outline" className="mt-2 sm:mt-0">
              <Save className="w-4 h-4 mr-2" />
              Save Explanation
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-sm prose max-w-none sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: marked(explanation) }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

