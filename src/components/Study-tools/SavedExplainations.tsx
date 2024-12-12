"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Trash2, BookOpen, Lightbulb, History, AlertTriangle, GraduationCap, Link, FlaskConical, Telescope } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { marked } from 'marked'

interface ExplanationSection {
  title: string;
  content: string;
  icon: React.ElementType;
}

interface SavedExplanation {
  concept: string;
  sections: ExplanationSection[];
  timestamp: number;
}

const sectionIcons = [
  BookOpen, Lightbulb, History, AlertTriangle, GraduationCap, Link, History, AlertTriangle, GraduationCap, Link, FlaskConical, Telescope
];

export default function SavedExplanations() {
  const [savedExplanations, setSavedExplanations] = useState<SavedExplanation[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('savedExplanations')
    if (saved) {
      setSavedExplanations(JSON.parse(saved))
    }
  }, [])

  const handleDelete = (index: number) => {
    const updatedExplanations = savedExplanations.filter((_, i) => i !== index)
    setSavedExplanations(updatedExplanations)
    localStorage.setItem('savedExplanations', JSON.stringify(updatedExplanations))
    toast({ title: "Success", description: "Explanation deleted successfully.", variant: "default" })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Explanations</h2>
      {savedExplanations.length === 0 ? (
        <p>No saved explanations yet.</p>
      ) : (
        savedExplanations.map((explanation, index) => (
          <Card key={index} className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{explanation.concept}</CardTitle>
                <CardDescription>
                  Saved on {new Date(explanation.timestamp).toLocaleString()}
                </CardDescription>
              </div>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(index)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {explanation.sections.map((section, sectionIndex) => (
                  <AccordionItem key={sectionIndex} value={`item-${sectionIndex}`}>
                    <AccordionTrigger>
                      <div className="flex items-center">
                        {sectionIcons[sectionIndex % sectionIcons.length] && React.createElement(sectionIcons[sectionIndex % sectionIcons.length], { className: "mr-2 h-5 w-5" })}
                        <span>{section.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose max-w-none dark:prose-invert">
                        <div dangerouslySetInnerHTML={{ __html: marked(section.content) }} />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

