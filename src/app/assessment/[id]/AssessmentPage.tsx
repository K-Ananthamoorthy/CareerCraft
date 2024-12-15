// src/app/assessment/[id]/AssessmentPage.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Textarea } from "@/components/ui/textarea"

interface Option {
  id: string
  option_text: string
}

interface Question {
  id: string
  question_text: string
  question_type: string
  correct_answer: string
  options: Option[]
  points: number
}

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  duration: string
  total_questions: number
  questions: Question[]
}

interface AssessmentPageProps {
  assessment: Assessment
}

export default function AssessmentPage({ assessment }: AssessmentPageProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const calculateScore = (): { score: number, totalPoints: number, correctAnswers: number } => {
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    assessment.questions.forEach(question => {
      totalPoints += question.points
      if (question.question_type === 'multiple_choice') {
        if (answers[question.id] === question.correct_answer) {
          correctAnswers++
          earnedPoints += question.points
        }
      } else if (question.question_type === 'open_ended') {
        // For open-ended questions, we'll assume partial credit based on answer length
        // This is a simplified scoring method and should be replaced with a more sophisticated approach
        const answerLength = answers[question.id]?.length || 0
        const score = Math.min(answerLength / 100, 1) // Assume a "full" answer is 100 characters
        earnedPoints += score * question.points
        if (score > 0.5) correctAnswers++ // Count as correct if more than half credit
      }
    })

    const score = (earnedPoints / totalPoints) * 10
    return { score: Math.round(score * 100) / 100, totalPoints, correctAnswers }
  }

  const handleSubmit = async () => {
    const { score, totalPoints, correctAnswers } = calculateScore()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error: resultError } = await supabase
        .from('assessment_results')
        .upsert({
          user_id: user.id,
          assessment_id: assessment.id,
          score: score,
          total_points: totalPoints,
          correct_answers: correctAnswers,
          completed_at: new Date().toISOString()
        })

      if (resultError) throw resultError

      // Update category score
      const { error: categoryScoreError } = await supabase
        .from('category_scores')
        .upsert({
          user_id: user.id,
          category_id: assessment.category,
          score: score,
          last_updated: new Date().toISOString()
        })

      if (categoryScoreError) throw categoryScoreError

      router.push(`/assessment/${assessment.id}/results?score=${score}&totalQuestions=${assessment.total_questions}&correctAnswers=${correctAnswers}`)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      // Handle error (e.g., show error message to user)
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">{assessment.title}</h1>
      <p className="mb-4">{assessment.description}</p>
      <p className="mb-2">Category: {assessment.category}</p>
      <p className="mb-2">Duration: {assessment.duration}</p>
      <p className="mb-6">Total Questions: {assessment.total_questions}</p>
      
      <div className="space-y-6">
        {assessment.questions.map((question, index) => (
          <div key={question.id} className="p-4 border rounded-lg">
            <h2 className="mb-2 font-semibold">Question {index + 1} (Points: {question.points})</h2>
            <p className="mb-2">{question.question_text}</p>
            {question.question_type === 'multiple_choice' ? (
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
            ) : (
              <Textarea
                id={`question-${question.id}`}
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Enter your answer here..."
                className="w-full mt-2"
              />
            )}
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