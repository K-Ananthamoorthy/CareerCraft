// app/assessment/[id]/results/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import ResultsPage from './ResultPage'

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <div>Please log in to view results.</div>
  }

  const { data: assessment, error: assessmentError } = await supabase
    .from('assessments')
    .select(`
      id,
      title,
      duration,
      categories (name),
      questions (
        id,
        question_text,
        correct_answer,
        options (
          id,
          option_text
        )
      )
    `)
    .eq('id', params.id)
    .single()

  const { data: result, error: resultError } = await supabase
    .from('assessment_results')
    .select('score, total_questions, correct_answers, answers, completed_at')
    .eq('assessment_id', params.id)
    .eq('user_id', user.id)
    .order('id', { ascending: false })
    .limit(1)
    .single()

  if (assessmentError || resultError) {
    console.error('Error fetching data:', assessmentError || resultError)
    return <div>Error loading results</div>
  }

  return <ResultsPage assessment={assessment} result={result} />
}