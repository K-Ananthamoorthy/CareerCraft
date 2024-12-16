// app/assessment/AssessmentsPage.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, CheckCircle, RefreshCw } from 'lucide-react'

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  duration: string
  total_questions: number
  max_attempts: number
}

interface AssessmentResult {
  assessment_id: string
  score: number
  attempt_number: number
  completed: boolean
}

interface AssessmentsPageProps {
  assessments: Assessment[]
  results: AssessmentResult[]
}

export default function AssessmentsPage({ assessments, results }: AssessmentsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>(assessments)

  useEffect(() => {
    const filtered = assessments.filter(assessment =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAssessments(filtered)
  }, [searchTerm, assessments])

  const getAssessmentStatus = (assessmentId: string) => {
    const assessmentResults = results.filter(result => result.assessment_id === assessmentId)
    const completedAttempts = assessmentResults.filter(result => result.completed)
    const latestAttempt = assessmentResults[assessmentResults.length - 1]
    const assessment = assessments.find(a => a.id === assessmentId)

    if (completedAttempts.length === 0) {
      return { status: 'Not Started', canRetake: true }
    }

    if (completedAttempts.length >= (assessment?.max_attempts || 2)) {
      return { status: 'Completed', score: latestAttempt.score, canRetake: false }
    }

    if (latestAttempt && !latestAttempt.completed) {
      return { status: 'In Progress', canRetake: false }
    }

    return { status: 'Completed', score: latestAttempt.score, canRetake: true }
  }

  const groupedAssessments = filteredAssessments.reduce((acc, assessment) => {
    if (!acc[assessment.category]) {
      acc[assessment.category] = []
    }
    acc[assessment.category].push(assessment)
    return acc
  }, {} as Record<string, Assessment[]>)

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Skill Assessments</h1>
      <p className="mb-6 text-base sm:text-lg">
        Take these assessments to evaluate your skills and get personalized learning recommendations.
      </p>
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search assessments by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
      </div>
      {Object.entries(groupedAssessments).map(([category, categoryAssessments]) => (
        <div key={category} className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">{category}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryAssessments.map((assessment) => {
              const { status, score, canRetake } = getAssessmentStatus(assessment.id)
              return (
                <Card key={assessment.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-xl">{assessment.title}</CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-end">
                    <p className="mb-2 text-sm">Duration: {assessment.duration}</p>
                    <p className="mb-4 text-sm">Questions: {assessment.total_questions}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="flex items-center">
                        {status === 'Completed' ? (
                          <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        ) : status === 'In Progress' ? (
                          <RefreshCw className="w-5 h-5 mr-2 text-yellow-600" />
                        ) : null}
                        {status}
                      </span>
                      {score !== undefined && (
                        <span className="font-semibold">
                          Score: {score.toFixed(2)}/10
                        </span>
                      )}
                    </div>
                    {canRetake ? (
                      <Button asChild className="w-full">
                        <Link href={`/assessment/${assessment.id}`}>
                          {status === 'Not Started' ? 'Start Assessment' : 'Retake Assessment'}
                        </Link>
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        {status === 'In Progress' ? 'Assessment In Progress' : 'Max Attempts Reached'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
      {Object.keys(groupedAssessments).length === 0 && (
        <p className="mt-8 text-center text-gray-500">No assessments found matching your search.</p>
      )}
    </div>
  )
}