// app/assessment/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AssessmentsPage from './AssessmentsPage'

export const metadata = {
  title: 'Skill Assessments',
  description: 'Take assessments to evaluate your skills and get personalized learning recommendations.',
}

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const { data: assessments, error: assessmentsError } = await supabase
    .from('assessments')
    .select(`
      *,
      categories (name)
    `)

  const { data: results, error: resultsError } = await supabase
    .from('assessment_results')
    .select('assessment_id, score, attempt_number, completed')
    .eq('user_id', user.id)

  if (assessmentsError || resultsError) {
    console.error('Error fetching data:', assessmentsError || resultsError)
    // Handle error state
  }

  return <AssessmentsPage assessments={assessments || []} results={results || []} />
}