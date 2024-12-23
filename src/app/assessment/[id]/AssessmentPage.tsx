'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from '@/hooks/use-toast'

interface Option {
  id: string
  option_text: string
}

interface Question {
  id: string
  question_text: string
  question_type: string
  correct_answer: string
  points: number
  difficulty: string
  options: Option[]
}

interface Assessment {
  id: string
  title: string
  description: string
  category_id: number
  duration: string
  total_questions: number
  max_attempts: number
  questions: Question[]
}

interface AssessmentPageProps {
  assessment: Assessment
}

export default function AssessmentPage({ assessment }: AssessmentPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (assessment?.duration) {
      const totalSeconds = parseDuration(assessment.duration)
      setTimeLeft(totalSeconds)

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleSubmit()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [assessment])

  const parseDuration = (duration: string): number => {
    const [hours, minutes] = duration.split(':').map(Number)
    return hours * 3600 + minutes * 60
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getLetterForOption = (options: Option[], optionId: string): string => {
    const index = options.findIndex(opt => opt.id === optionId)
    return String.fromCharCode(97 + index)
  }

  const handleAnswerChange = (questionId: string, optionId: string) => {
    const question = assessment.questions.find(q => q.id === questionId)
    if (!question) return

    const letterAnswer = getLetterForOption(question.options, optionId)
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: letterAnswer
    }))
  }

  const calculateScore = (): number => {
    let correctCount = 0
    assessment.questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++
      }
    })
    return correctCount
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const correctAnswers = calculateScore()
      const totalQuestions = assessment.questions.length

      const { data: attempts } = await supabase
        .from('assessment_attempts')
        .select('attempt_number')
        .eq('user_id', user.id)
        .eq('assessment_id', assessment.id)
        .order('attempt_number', { ascending: false })
        .limit(1)

      const currentAttempt = attempts?.[0]?.attempt_number || 1

      await supabase
        .from('assessment_attempts')
        .update({ completed_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('assessment_id', assessment.id)
        .eq('attempt_number', currentAttempt)

      const { error } = await supabase
        .from('assessment_results')
        .insert({
          user_id: user.id,
          assessment_id: assessment.id,
          score: correctAnswers,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          answers: answers,
          attempt_number: currentAttempt,
          completed: true
        })

      if (error) throw error

      toast({
        title: 'Assessment Submitted',
        description: `Your score: ${correctAnswers}/${totalQuestions}`,
      })

      router.push(`/assessment/${assessment.id}/results`)
    } catch (error) {
      console.error('Error submitting assessment:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit assessment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!assessment?.questions?.length) {
    return <div>Loading assessment or no questions available...</div>
  }

  const currentQuestion = assessment.questions[currentQuestionIndex]

  return (
    <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>{assessment.title}</CardTitle>
          <CardDescription>{assessment.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-right">
            Time Remaining: {formatTime(timeLeft)}
          </div>
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </h3>
            <p className="mb-4">{currentQuestion.question_text}</p>
            <RadioGroup
              value={answers[currentQuestion.id] ? 
                currentQuestion.options[answers[currentQuestion.id].charCodeAt(0) - 97]?.id || '' : 
                ''}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.option_text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < assessment.questions.length - 1 ? (
              <Button onClick={handleNextQuestion}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}