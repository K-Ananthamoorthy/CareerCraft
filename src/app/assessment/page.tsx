'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { supabase } from '@/lib/supabase/client'
import LoadingSpinner from '@/components/LoadingSpinner' // Import the loading spinner

interface Assessment {
  id: string
  title: string
  description: string
  duration: string
}

export default function AssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) // Error state

  useEffect(() => {
    async function fetchAssessments() {
      setIsLoading(true) // Set loading to true before fetching
      const { data, error } = await supabase
        .from('assessments')
        .select('*')

      if (error) {
        console.error('Error fetching assessments:', error)
        setError('Failed to fetch assessments. Please try again later.') // Set error message
      } else {
        setAssessments(data)
        setFilteredAssessments(data)
      }
      setIsLoading(false) // Set loading to false after fetching
    }

    fetchAssessments()
  }, [])

  useEffect(() => {
    const results = assessments.filter(assessment =>
      assessment.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredAssessments(results)
  }, [searchTerm, assessments])

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Skill Assessments</h1>
      <p className="mb-6 text-base sm:text-lg">
        Take these assessments to evaluate your skills and get personalized learning recommendations.
      </p>
      <div className="relative mb-6">
        <Input
          type="text"
          placeholder="Search assessments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={20} />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner /> {/* Use the loading spinner component here */}
        </div>
      ) : error ? (
        <p className="mt-8 text-center text-red-500">{error}</p> // Display error message
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment) => (
            <Card key={assessment.id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-xl">{assessment.title}</CardTitle>
                <CardDescription>{assessment.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-end">
                <p className="mb-4 text-sm">Duration: {assessment.duration}</p>
                <Button asChild className="w-full">
                  <Link href={`/assessment/${assessment.id}`}>Start Assessment</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {filteredAssessments.length === 0 && !isLoading && (
        <p className="mt-8 text-center text-gray-500">No assessments found matching your search.</p>
      )}
    </div>
  )
}
