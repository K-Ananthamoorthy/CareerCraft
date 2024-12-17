'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Target, Award } from 'lucide-react'

interface ResultsPageProps {
  assessment: {
    id: string
    title: string
    categories: { name: string }[]
    duration: string
    questions: {
      id: string
      question_text: string
      correct_answer: string
      options: { id: string; option_text: string }[]
    }[]
  }
  result: {
    score: number
    total_questions: number
    correct_answers: number
    answers: Record<string, string>
    completed_at: string
  }
}

export default function ResultsPage({ assessment, result }: ResultsPageProps) {
  const score = result.score
  const totalQuestions = result.total_questions
  const percentageScore = (score / totalQuestions) * 100
  const feedback = getFeedback(percentageScore)
  const timeTaken = getTimeTaken(assessment.duration, result.completed_at)

  const getOptionText = (questionId: string, optionLetter: string) => {
    const question = assessment.questions.find(q => q.id === questionId)
    if (!question) return ''
    const optionIndex = optionLetter.charCodeAt(0) - 97 // 'a' -> 0, 'b' -> 1, etc.
    return question.options[optionIndex]?.option_text || ''
  }

  return (
    <div className="container max-w-4xl px-4 py-8 mx-auto">
      <Card className="mb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Assessment Results</CardTitle>
          <CardDescription>{assessment.title} - {assessment.categories[0]?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-5xl font-bold">{score}</span>
                <span className="text-3xl">/{totalQuestions}</span>
              </div>
              <Progress value={percentageScore} className="w-full h-3" />
              <p className="text-lg font-semibold text-center">
                {percentageScore.toFixed(1)}% Correct
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-green-500" />
                <span>Correct Answers: {score}</span>
              </div>
              <div className="flex items-center">
                <XCircle className="w-6 h-6 mr-2 text-red-500" />
                <span>Incorrect Answers: {totalQuestions - score}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2 text-blue-500" />
                <span>Time Taken: {timeTaken}</span>
              </div>
              <div className="flex items-center">
                <Target className="w-6 h-6 mr-2 text-purple-500" />
                <span>Accuracy: {(score / totalQuestions * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="mb-2 text-xl font-semibold">Feedback</h3>
            <p className="text-lg">{feedback}</p>
          </div>
        </CardContent>
      </Card>

      <h3 className="mb-4 text-2xl font-bold">Question Breakdown</h3>
      {assessment.questions.map((question, index) => {
        const userAnswer = result.answers[question.id]
        const isCorrect = userAnswer === question.correct_answer
        return (
          <Card key={question.id} className={`mb-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">Question {index + 1}</span>
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{question.question_text}</p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div>
                  <p className="font-semibold">Your Answer:</p>
                  <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                    {getOptionText(question.id, userAnswer)}
                  </p>
                </div>
                {!isCorrect && (
                  <div>
                    <p className="font-semibold">Correct Answer:</p>
                    <p className="text-green-600">
                      {getOptionText(question.id, question.correct_answer)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      <div className="flex justify-between mt-8">
        <Button asChild variant="outline">
          <Link href="/assessment">Back to Assessments</Link>
        </Button>
        <Button asChild>
          <Link href={`/assessment/${assessment.id}`}>Retake Assessment</Link>
        </Button>
      </div>
    </div>
  )
}

function getFeedback(score: number): string {
  if (score >= 90) {
    return "Outstanding performance! You've demonstrated an excellent understanding of the subject matter."
  } else if (score >= 80) {
    return "Great job! You've shown a strong grasp of the material with just a few areas for improvement."
  } else if (score >= 70) {
    return "Good work! You've demonstrated a solid understanding, but there's room to strengthen your knowledge in some areas."
  } else if (score >= 60) {
    return "You're on the right track! Review the topics you struggled with to improve your understanding."
  } else {
    return "Keep practicing! Focus on the areas where you had difficulty and consider reviewing the material again."
  }
}

function getTimeTaken(duration: string, completedAt: string): string {
  const [hours, minutes] = duration.split(':').map(Number)
  const totalMinutes = hours * 60 + minutes
  const completionTime = new Date(completedAt)
  const startTime = new Date(completionTime.getTime() - totalMinutes * 60000)
  const timeDiff = completionTime.getTime() - startTime.getTime()
  const minutesTaken = Math.round(timeDiff / 60000)
  return `${minutesTaken} minutes`
}