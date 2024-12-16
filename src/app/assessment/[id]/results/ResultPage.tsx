'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const [assessmentTitle, setAssessmentTitle] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [score, setScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const searchParams = useSearchParams()
  
  // Fetch the parameters
  const totalQuestionsRaw = searchParams.get('totalQuestions')
  const correctAnswersRaw = searchParams.get('correctAnswers')
  const totalQuestions = Number(totalQuestionsRaw)
  const correctAnswers = Number(correctAnswersRaw)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAssessmentDetails = async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select(`
          title,
          categories(name)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching assessment details:', error)
      } else if (data) {
        setAssessmentTitle(data.title)
        setCategoryName(data.categories[0]?.name || 'Unknown Category')
      }
    }

    fetchAssessmentDetails()
  }, [supabase, params.id])

  useEffect(() => {
    // Log raw values for debugging
    console.log('Raw totalQuestions:', totalQuestionsRaw)
    console.log('Raw correctAnswers:', correctAnswersRaw)

    // Validate and calculate score
    if (!isNaN(totalQuestions) && !isNaN(correctAnswers) && totalQuestions > 0) {
      const calculatedScore = (correctAnswers / totalQuestions) * 10 // Scale to 10
      setScore(calculatedScore)

      // Set feedback
      if (calculatedScore >= 8) {
        setFeedback("Excellent work! You've demonstrated a strong understanding of this category.")
      } else if (calculatedScore >= 6) {
        setFeedback("Good job! You've shown a solid grasp of the material, but there's room for improvement.")
      } else {
        setFeedback("You've made a good start, but there's significant room for improvement. Consider reviewing the material and trying again.")
      }
    } else {
      console.error('Invalid totalQuestions or correctAnswers:', {
        totalQuestions,
        correctAnswers,
      })
      setScore(null) // Reset score on invalid input
      setFeedback("Invalid results. Please try retaking the assessment.")
    }
  }, [totalQuestions, correctAnswers])

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Assessment Results</h1>
      <p className="mb-2">Assessment: {assessmentTitle}</p>
      <p className="mb-2">Category: {categoryName}</p>
      <p className="mb-2">
        Your score: {score !== null ? score.toFixed(1) : 'N/A'} out of 10
      </p>
      <p className="mb-2">Total questions: {totalQuestions || 'N/A'}</p>
      <p className="mb-6">Correct answers: {correctAnswers || 'N/A'}</p>
      
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Feedback</h2>
        <p>{feedback}</p>
      </div>
      
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/assessment">Back to Assessments</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/assessment/${params.id}`}>Retake Assessment</Link>
        </Button>
      </div>
    </div>
  )
}
