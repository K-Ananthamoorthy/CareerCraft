// src/app/assessment/page.tsx
import { Suspense } from 'react'
import AssessmentsPage from './AssessmentsPage'
import LoadingSpinner from '@/components/LoadingSpinner'

export const metadata = {
  title: 'Skill Assessments',
  description: 'Take assessments to evaluate your skills in various categories.',
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AssessmentsPage />
    </Suspense>
  )
}