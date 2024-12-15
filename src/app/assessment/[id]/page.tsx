// src/app/assessment/[id]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import AssessmentPage from './AssessmentPage'
import { Metadata } from 'next'

interface Params {
  id: string
}

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  duration: string
  total_questions: number
  questions: {
    id: string
    question_text: string
    question_type: string
    correct_answer: string
    points: number
    options: {
      id: string
      option_text: string
    }[]
  }[]
}

async function getAssessment(id: string): Promise<Assessment | null> {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data: assessment, error } = await supabase
    .from('assessments')
    .select(`
      *,
      categories(name)
    `)
    .eq('id', id)
    .single()

  if (error || !assessment) {
    console.error('Error fetching assessment:', error)
    return null
  }

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('id, question_text, question_type, correct_answer, points')
    .eq('assessment_id', id)

  if (questionsError) {
    console.error('Error fetching questions:', questionsError)
    return null
  }

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const { data: options, error: optionsError } = await supabase
        .from('options')
        .select('id, option_text')
        .eq('question_id', question.id)

      if (optionsError) {
        console.error('Error fetching options:', optionsError)
        return question
      }

      return { ...question, options }
    })
  )

  return { 
    ...assessment, 
    category: assessment.categories.name,
    questions: questionsWithOptions 
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const assessment = await getAssessment(params.id)
  return {
    title: assessment ? `${assessment.title} Assessment` : 'Assessment Not Found',
    description: assessment ? assessment.description : 'Assessment details not available',
  }
}

export default async function Page({ params }: { params: Params }) {
  const assessment = await getAssessment(params.id)

  if (!assessment) {
    notFound()
  }

  return <AssessmentPage assessment={assessment} />
}