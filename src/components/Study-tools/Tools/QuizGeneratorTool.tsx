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

export default function QuizGeneratorTool() {
  const [topic, setTopic] = useState('')
  const [numQuestions, setNumQuestions] = useState('5')
  const [quiz, setQuiz] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast({ title: "Error", description: "Please enter a topic for the quiz.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI quiz generator specialized in creating quizzes for engineering students in India.
        Create a quiz on the following topic:
        Topic: ${topic}
        Number of questions: ${numQuestions}

        Generate a quiz with the following characteristics:
        1. Mix of multiple-choice, short-answer, and numerical problem-solving questions
        2. Varying difficulty levels (easy, medium, hard) to cater to different student capabilities
        3. Clear and concise questions that test both theoretical knowledge and practical application
        4. Questions that align with the Indian engineering curriculum and exam patterns (e.g., GATE, university exams)
        5. Inclusion of questions that relate to Indian industry standards and practices
        6. Correct answers provided for each question
        7. Brief explanations for the correct answers, including relevant formulas or concepts

        Format the quiz as follows:
        Question 1: [Question text]
        Type: [Multiple Choice / Short Answer / Numerical]
        Difficulty: [Easy / Medium / Hard]
        A) [Option A]
        B) [Option B]
        C) [Option C]
        D) [Option D]
        Correct Answer: [Letter of correct option or answer for short answer/numerical]
        Explanation: [Brief explanation of the correct answer, including relevant formulas or concepts]

        [Repeat for each question]

        For short-answer and numerical questions, provide the question, correct answer, and explanation.
      `);
      const response = await result.response;
      setQuiz(response.text());
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({ title: "Error", description: "An error occurred while generating the quiz. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="topic">Quiz Topic:</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Digital Electronics, Thermodynamics, Data Structures..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="numQuestions">Number of Questions:</Label>
          <Input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            min="1"
            max="20"
          />
        </div>
        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          Generate Quiz
        Generate Quiz
        </Button>
      </form>
      {quiz && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">Generated Quiz:</h3>
          <Textarea
            value={quiz}
            readOnly
            className="w-full h-[400px] mt-2"
          />
        </div>
      )}
    </div>
  )
}

