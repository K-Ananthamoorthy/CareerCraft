import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import AssessmentPage from './AssessmentPage'

async function getAssessment(id: string) {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: assessment, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching assessment:', error)
    return null
  }

  if (!assessment) {
    return null
  }

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('id, question_text, correct_answer')
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

  return { ...assessment, questions: questionsWithOptions }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params  // Await the params to resolve
  const assessment = await getAssessment(id)

  if (!assessment) {
    notFound()
  }

  return <AssessmentPage assessment={assessment} />
}
