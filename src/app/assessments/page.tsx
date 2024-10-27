import { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Assessments | AI-Powered Learning Platform",
  description: "Take skill assessments and track your progress",
}

const assessments = [
  {
    id: "engineering-fundamentals",
    title: "Engineering Fundamentals",
    description: "Test your knowledge of core engineering concepts",
    duration: "30 minutes",
  },
  {
    id: "data-structures-algorithms",
    title: "Data Structures & Algorithms",
    description: "Evaluate your problem-solving skills",
    duration: "45 minutes",
  },
  {
    id: "web-technologies",
    title: "Web Technologies",
    description: "Assess your understanding of modern web development",
    duration: "40 minutes",
  },
  {
    id: "database-systems",
    title: "Database Systems",
    description: "Test your knowledge of database concepts and SQL",
    duration: "35 minutes",
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    description: "Evaluate your understanding of software development processes",
    duration: "40 minutes",
  },
]

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Skill Assessments</h1>
      <p className="mb-6 text-lg">
        Take these assessments to evaluate your skills and get personalized learning recommendations.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {assessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <CardTitle>{assessment.title}</CardTitle>
              <CardDescription>{assessment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Duration: {assessment.duration}</p>
              <Button asChild>
                <Link href={`/assessments/${assessment.id}`}>Start Assessment</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}