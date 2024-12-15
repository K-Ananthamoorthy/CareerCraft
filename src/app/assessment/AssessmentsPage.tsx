'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Assessment {
  id: string
  title: string
  description: string
  category: string
  duration: string
  categories: {
    name: string
  }
}

interface AssessmentResult {
  id: string
  assessment_id: string
  score: number
  completed_at: string
}

export default function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [takenAssessments, setTakenAssessments] = useState<AssessmentResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('No user found')

        const [{ data: assessmentsData, error: assessmentsError }, { data: resultsData, error: resultsError }] = await Promise.all([
          supabase
            .from('assessments')
            .select(`
              *,
              categories (name)
            `),
          supabase
            .from('assessment_results')
            .select('*')
            .eq('user_id', user.id)
        ])

        if (assessmentsError) throw assessmentsError
        if (resultsError) throw resultsError

        const formattedAssessments = assessmentsData?.map(assessment => ({
          ...assessment,
          category: assessment.categories?.name || 'Uncategorized'
        })) || []

        setAssessments(formattedAssessments)
        setFilteredAssessments(formattedAssessments)
        setTakenAssessments(resultsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to fetch assessments. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  useEffect(() => {
    const results = assessments.filter(assessment =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAssessments(results)
  }, [searchTerm, assessments])

  const isTaken = (assessmentId: string) => {
    return takenAssessments.some(result => result.assessment_id === assessmentId)
  }

  const getScore = (assessmentId: string) => {
    const result = takenAssessments.find(result => result.assessment_id === assessmentId)
    return result ? result.score : null
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
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <p className="mt-8 text-center text-red-500">{error}</p>
      ) : (
        Object.entries(groupedAssessments).map(([category, categoryAssessments]) => (
          <div key={category} className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">{category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categoryAssessments.map((assessment) => (
                <Card key={assessment.id} className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-xl">{assessment.title}</CardTitle>
                    <CardDescription>{assessment.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-end">
                    <p className="mb-4 text-sm">Duration: {assessment.duration}</p>
                    {isTaken(assessment.id) ? (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-5 h-5 mr-2" />
                          Completed
                        </span>
                        <span className="font-semibold">
                          Score: {getScore(assessment.id)}/10
                        </span>
                      </div>
                    ) : (
                      <Button asChild className="w-full">
                        <Link href={`/assessment/${assessment.id}`}>Start Assessment</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}
      {Object.keys(groupedAssessments).length === 0 && !isLoading && (
        <p className="mt-8 text-center text-gray-500">No assessments found matching your search.</p>
      )}
    </div>
  )
}