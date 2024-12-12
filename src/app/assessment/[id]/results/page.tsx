// app/assessment/[id]/results/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type PageProps = {
  params: {
    id: string;
  };
};

export default function ResultsPage({ params }: PageProps) {
  const [assessmentTitle, setAssessmentTitle] = useState('')
  const searchParams = useSearchParams()
  const score = searchParams.get('score')
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAssessmentTitle = async () => {
      const { data, error } = await supabase
        .from('assessments')
        .select('title')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching assessment title:', error)
      } else if (data) {
        setAssessmentTitle(data.title)
      }
    }

    fetchAssessmentTitle()
  }, [supabase, params.id])

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Assessment Results</h1>
      <p className="mb-2">Assessment: {assessmentTitle}</p>
      <p className="mb-6">Your score: {score} out of 10</p>
      <Button asChild>
        <Link href="/assessment">Back to Assessments</Link>
      </Button>
    </div>
  )
}