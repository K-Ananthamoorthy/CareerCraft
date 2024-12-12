"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export default function VocabularyBuilderTool() {
  const [topic, setTopic] = useState('')
  const [numWords, setNumWords] = useState('10')
  const [vocabularyList, setVocabularyList] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast({ title: "Error", description: "Please enter a topic for vocabulary building.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI vocabulary builder specialized in creating vocabulary lists for engineering students in India.
        Create a list of technical vocabulary words based on the following information:
        Topic: ${topic}
        Number of words: ${numWords}

        For each word, provide:
        1. The word itself (technical term)
        2. Its definition in the context of Indian engineering
        3. An example sentence using the word in an engineering context
        4. Related terms or concepts
        5. Hindi translation or equivalent (if applicable)
        6. Pronunciation guide (using IPA)
        7. Common usage in Indian industry or academic settings
        8. Any relevant notes on usage or context specific to Indian engineering practices

        Format the vocabulary list as follows:

        1. [Technical Term]
        Definition: [Definition in the context of Indian engineering]
        Example: [Example sentence using the word in an engineering context]
        Related Terms: [Related term 1, Related term 2, ...]
        Hindi Translation: [Hindi equivalent or transliteration]
        Pronunciation: [IPA pronunciation guide]
        Usage in Indian Context: [Brief explanation of how the term is used in Indian industry or academics]
        Notes: [Any additional information relevant to Indian engineering students]

        [Repeat for each word]

        Ensure that the words are appropriate for the engineering topic and vary in difficulty to cater to different levels of students.
      `);
      const response = await result.response;
      setVocabularyList(response.text());
    } catch (error) {
      console.error("Error generating vocabulary list:", error);
      toast({ title: "Error", description: "An error occurred while generating the vocabulary list. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="topic">Engineering Topic for Vocabulary:</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Robotics, Power Systems, Software Engineering..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numWords">Number of Words:</Label>
          <Input
            id="numWords"
            type="number"
            value={numWords}
            onChange={(e) => setNumWords(e.target.value)}
            min="5"
            max="20"
          />
        </div>
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Generate Vocabulary List
        </Button>
      </form>
      {vocabularyList && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">Generated Vocabulary List:</h3>
          <Textarea
            value={vocabularyList}
            readOnly
            className="w-full h-[400px] mt-2"
          />
        </div>
      )}
    </div>
  )
}

