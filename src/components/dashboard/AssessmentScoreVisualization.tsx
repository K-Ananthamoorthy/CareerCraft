"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface AssessmentScore {
  category: string
  score: number
}

export default function AssessmentScoreVisualization() {
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScore[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchAssessmentScores()
  }, [])

  const fetchAssessmentScores = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("No user found")

      const { data, error } = await supabase
        .from('assessment_results')
        .select(`
          assessments (category),
          score
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const formattedScores = data.map(item => ({
        category: item.assessments[0].category,
        score: item.score
      }))

      setAssessmentScores(formattedScores)
    } catch (error) {
      console.error('Error fetching assessment scores:', error)
      toast({
        title: "Error",
        description: "Failed to load assessment scores. Please try again.",
        variant: "destructive",
      })
    }
  }

  const data = {
    labels: assessmentScores.map(item => item.category),
    datasets: [
      {
        label: 'Assessment Scores',
        data: assessmentScores.map(item => item.score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Assessment Scores'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Bar data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  )
}

