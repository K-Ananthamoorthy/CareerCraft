'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface AssessmentData {
  name: string
  score: number
}

export function AssessmentPerformanceChart() {
  const [data, setData] = useState<AssessmentData[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchAssessmentData() {
      const { data, error } = await supabase
        .from('assessments')
        .select('title, assessment_results(score)')
        .limit(5)

      if (data) {
        const chartData = data.map(assessment => ({
          name: assessment.title,
          score: assessment.assessment_results.reduce((acc, result) => acc + result.score, 0) / assessment.assessment_results.length
        }))
        setData(chartData)
      }
    }

    fetchAssessmentData()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

