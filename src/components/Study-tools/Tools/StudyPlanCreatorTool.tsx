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

export default function StudyPlanCreatorTool() {
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('')
  const [goals, setGoals] = useState('')
  const [studyPlan, setStudyPlan] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !duration.trim() || !goals.trim()) {
      toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI study plan creator specialized in developing comprehensive study plans for engineering students in India.
        Create a detailed study plan based on the following information:
        Subject: ${subject}
        Duration: ${duration}
        Goals: ${goals}

        Create a detailed study plan that includes:
        1. An overview of the subject and main topics to be covered, aligned with the Indian engineering curriculum
        2. A weekly breakdown of study activities and topics, considering the typical academic schedule in Indian engineering colleges
        3. Recommended resources including standard textbooks used in Indian universities, online courses, and reference materials
        4. Suggested study techniques and strategies tailored for Indian engineering students
        5. Milestones and progress checkpoints aligned with the Indian academic calendar
        6. Tips for maintaining motivation and avoiding burnout, considering the challenges faced by Indian engineering students
        7. A method for tracking progress and self-assessment, including practice questions and mock tests
        8. Preparation strategies for various types of assessments common in Indian engineering education (e.g., written exams, viva voce, practical exams)
        9. Integration of practical components and laboratory work, if applicable
        10. Suggestions for group study sessions and peer learning opportunities
        11. Guidance on balancing this subject with other coursework and extracurricular activities
        12. Recommendations for exam preparation, including strategies for tackling different question types

        Format the study plan in a clear, structured manner using headings, subheadings, and bullet points where appropriate.
      `);
      const response = await result.response;
      setStudyPlan(response.text());
    } catch (error) {
      console.error("Error creating study plan:", error);
      toast({ title: "Error", description: "An error occurred while creating the study plan. Please try again.", variant: "destructive" })
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
            placeholder="e.g., Advanced Control Systems, Computer Networks, Structural Engineering..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Study Duration:</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g., 1 semester, 3 months, 1 year..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="goals">Study Goals:</Label>
          <Textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="List your specific learning objectives, exam targets, or skill development goals..."
            rows={3}
          />
        </div>
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Create Study Plan
        </Button>
      </form>
      {studyPlan && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">Your Personalized Study Plan:</h3>
          <div className="text-sm whitespace-pre-wrap">{studyPlan}</div>
        </div>
      )}
    </div>
  )
}

