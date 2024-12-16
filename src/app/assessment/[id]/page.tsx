// app/assessment/[id]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import AssessmentPage from './AssessmentPage'
import { Metadata } from 'next'

interface Params {
  id: string
}

interface Assessment {
  id: string
  title: string
  description: string
  category_id: number
  duration: string
  total_questions: number
  max_attempts: number
  questions: {
    id: string
    question_text: string
    question_type: string
    correct_answer: string
    points: number
    difficulty: string
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
      questions (
        id,
        question_text,
        question_type,
        correct_answer,
        points,
        difficulty,
        options (
          id,
          option_text
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching assessment:', error)
    return null
  }

  return assessment
}

async function checkAssessmentEligibility(assessmentId: string) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: assessment } = await supabase
    .from('assessments')
    .select('max_attempts')
    .eq('id', assessmentId)
    .single()

  const { data: attempts, error: attemptsError } = await supabase
    .from('assessment_attempts')
    .select('attempt_number, completed_at')
    .eq('user_id', user.id)
    .eq('assessment_id', assessmentId)
    .order('attempt_number', { ascending: false })

  if (attemptsError) {
    console.error('Error checking assessment eligibility:', attemptsError)
    return false
  }

  if (attempts && attempts.length >= (assessment?.max_attempts || 2)) {
    return false
  }

  const lastAttempt = attempts?.[0]
  if (lastAttempt && !lastAttempt.completed_at) {
    // There's an incomplete attempt, allow continuing
    return true
  }

  // Start a new attempt
  const { error: newAttemptError } = await supabase
    .from('assessment_attempts')
    .insert({
      user_id: user.id,
      assessment_id: assessmentId,
      attempt_number: (lastAttempt?.attempt_number || 0) + 1
    })

  if (newAttemptError) {
    console.error('Error creating new attempt:', newAttemptError)
    return false
  }

  return true
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

  const isEligible = await checkAssessmentEligibility(params.id)

  if (!isEligible) {
    redirect('/assessment')
  }

  return <AssessmentPage assessment={assessment} />
}