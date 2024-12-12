"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, BookOpen, Lightbulb, History, AlertTriangle, GraduationCap, Link, FlaskConical, Telescope, Save } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { marked } from 'marked'
import React from 'react'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

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

export default function ConceptExplainerTool() {
  const [concept, setConcept] = useState('')
  const [explanation, setExplanation] = useState<ExplanationSection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [savedExplanations, setSavedExplanations] = useState<SavedExplanation[]>([])

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
        You are an AI concept explainer specialized in explaining engineering concepts to students in India.
        Explain the following concept in detail, tailoring the explanation to the context of Indian engineering education:
        ${concept}

        Provide a comprehensive explanation that includes the following sections:
        1. Definition
        2. Key Components
        3. Principles and Theories
        4. Mathematical Formulas
        5. Real-World Applications in India
        6. Applications in Different Engineering Fields
        7. Historical Context and Indian Contributions
        8. Common Misconceptions and Challenges
        9. Relevance to Indian Engineering Curriculum and Exams
        10. Connections to Other Concepts
        11. Practical Implementations and Laboratory Experiments
        12. Recent Advancements and Research in India

        Format your response with clear section headers (e.g., "## Definition") and use Markdown syntax for formatting.
      `);
      const response = await result.response;
      const content = response.text();
      
      const sections = content.split(/(?=##\s)/).filter(Boolean);
      
      const parsedSections: ExplanationSection[] = sections.map((section, index) => {
        const [title, ...contentParts] = section.split('\n');
        return {
          title: title.replace('##', '').trim(),
          content: contentParts.join('\n').trim(),
          icon: sectionIcons[index % sectionIcons.length]
        };
      });
      
      setExplanation(parsedSections);
    } catch (error) {
      console.error("Error explaining concept:", error);
      toast({ title: "Error", description: "An error occurred while explaining the concept. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = () => {
    if (explanation.length === 0) {
      toast({ title: "Error", description: "No explanation to save.", variant: "destructive" })
      return
    }
    const newSavedExplanation: SavedExplanation = {
      concept,
      sections: explanation,
      timestamp: Date.now()
    }
    const updatedSavedExplanations = [...savedExplanations, newSavedExplanation]
    setSavedExplanations(updatedSavedExplanations)
    localStorage.setItem('savedExplanations', JSON.stringify(updatedSavedExplanations))
    toast({ title: "Success", description: "Explanation saved successfully.", variant: "default" })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="concept">Enter an engineering concept to explain:</Label>
          <Input
            id="concept"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g., Fourier Transform, Finite Element Analysis, VLSI Design..."
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Explain Concept
        </Button>
      </form>
      {explanation.length > 0 && (
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{concept}</CardTitle>
              <CardDescription>Comprehensive explanation for engineering students in India</CardDescription>
            </div>
            <Button onClick={handleSave} className="ml-auto">
              <Save className="w-4 h-4 mr-2" />
              Save Explanation
            </Button>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {explanation.map((section, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>
                    <div className="flex items-center">
                      {React.createElement(section.icon, { className: "mr-2 h-5 w-5" })}
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
      )}
    </div>
  )
}

