// src/app/assessment/[id]/results/ResultsPage.tsx
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
  const searchParams = useSearchParams()
  const score = searchParams.get('score')
  const totalQuestions = searchParams.get('totalQuestions')
  const correctAnswers = searchParams.get('correctAnswers')
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
        setCategoryName(data.categories[0].name)
      }
    }

    fetchAssessmentDetails()
  }, [supabase, params.id])

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Assessment Results</h1>
      <p className="mb-2">Assessment: {assessmentTitle}</p>
      <p className="mb-2">Category: {categoryName}</p>
      <p className="mb-2">Your score: {score} out of 10</p>
      <p className="mb-2">Total questions: {totalQuestions}</p>
      <p className="mb-6">Correct answers: {correctAnswers}</p>
      
      <div className="mb-6">
        <h2 className="mb-2 text-xl font-semibold">Feedback</h2>
        <p>
          {parseFloat(score || '0') >= 8
            ? "Excellent work! You've demonstrated a strong understanding of this category."
            : parseFloat(score || '0') >= 6
            ? "Good job! You've shown a solid grasp of the material, but there's room for improvement."
            : "You've made a good start, but there's significant room for improvement. Consider reviewing the material and trying again."}
        </p>
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