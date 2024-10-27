'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

interface Option {
  id: string
  option_text: string
}

interface Question {
  id: string
  question_text: string
  correct_answer: number
  options: Option[]
}

interface Assessment {
  id: string
  title: string
  description: string
  duration: string
  questions: Question[]
}

export default function AssessmentPage({ assessment }: { assessment: Assessment }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const router = useRouter()

  const handleAnswerChange = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }

  const handleSubmit = async () => {
    // Here you would typically send the answers to your backend
    console.log('Submitting answers:', answers)
    
    // For demonstration, we'll just redirect to a results page
    router.push(`/assessment/${assessment.id}/results`)
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">{assessment.title}</h1>
      <p className="mb-4">{assessment.description}</p>
      <p className="mb-6">Duration: {assessment.duration}</p>
      
      <div className="space-y-6">
        {assessment.questions.map((question, index) => (
          <div key={question.id} className="p-4 border rounded-lg">
            <h2 className="mb-2 font-semibold">Question {index + 1}</h2>
            <p className="mb-2">{question.question_text}</p>
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input 
                    type="radio" 
                    id={`q${question.id}-o${option.id}`} 
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswerChange(question.id, option.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`q${question.id}-o${option.id}`}>{option.option_text}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <Button asChild variant="outline">
          <Link href="/assessment">Back to Assessments</Link>
        </Button>
        <Button onClick={handleSubmit}>Submit Assessment</Button>
      </div>
    </div>
  )
}