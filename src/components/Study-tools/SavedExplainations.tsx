"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, BookOpen, Lightbulb, Compass } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { marked } from 'marked'

interface SavedExplanation {
  id: string;
  concept: string;
  content: string;
  timestamp: number;
  mode: string;
}

export default function SavedExplanations() {
  const [savedExplanations, setSavedExplanations] = useState<SavedExplanation[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('savedExplanations')
    if (saved) {
      setSavedExplanations(JSON.parse(saved))
    }
  }, [])

  const handleDelete = (id: string) => {
    const updatedExplanations = savedExplanations.filter((exp) => exp.id !== id)
    setSavedExplanations(updatedExplanations)
    localStorage.setItem('savedExplanations', JSON.stringify(updatedExplanations))
    toast({ title: "Success", description: "Explanation deleted successfully.", variant: "default" })
  }

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'informative':
        return <BookOpen className="w-5 h-5" />;
      case 'fun':
        return <Lightbulb className="w-5 h-5" />;
      case 'general':
        return <Compass className="w-5 h-5" />;
      default:
        return null;
    }
  }

  return (
    <div className="max-w-4xl p-4 mx-auto space-y-4 sm:p-6">
      <h2 className="text-2xl font-bold">Saved Explanations</h2>
      {savedExplanations.length === 0 ? (
        <p>No saved explanations yet.</p>
      ) : (
        savedExplanations.map((explanation) => (
          <Card key={explanation.id} className="mt-4 overflow-hidden">
            <CardHeader className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <CardTitle className="text-lg sm:text-xl">{explanation.concept}</CardTitle>
                <span className="flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-full">
                  {getModeIcon(explanation.mode)}
                  <span className="ml-1">{explanation.mode}</span>
                </span>
              </div>
              <div className="flex items-center mt-2 space-x-2 sm:mt-0">
                <CardDescription className="text-sm">
                  {new Date(explanation.timestamp).toLocaleString()}
                </CardDescription>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(explanation.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm prose max-w-none dark:prose-invert sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: marked(explanation.content ? explanation.content.toString() : '') }} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}


