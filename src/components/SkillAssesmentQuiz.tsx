"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "@/hooks/use-toast"

// Engineering-focused questions for Indian students
const questions = [
  {
    id: 1,
    question: "Which of the following sorting algorithms has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"],
    correctAnswer: "Quick Sort",
  },
  {
    id: 2,
    question: "What is the full form of GATE in the context of Indian engineering education?",
    options: ["Graduate Aptitude Test in Engineering", "General Aptitude and Technical Examination", "Graduate Assessment and Testing Exam", "General Advanced Technical Evaluation"],
    correctAnswer: "Graduate Aptitude Test in Engineering",
  },
  {
    id: 3,
    question: "Which of the following is not a type of software testing?",
    options: ["Unit Testing", "Integration Testing", "Regression Testing", "Compilation Testing"],
    correctAnswer: "Compilation Testing",
  },
  {
    id: 4,
    question: "What does IoT stand for in the context of modern technology?",
    options: ["Internet of Things", "Integration of Technology", "Input/Output Technology", "Interconnected Operating Terminals"],
    correctAnswer: "Internet of Things",
  },
  {
    id: 5,
    question: "Which of the following is a popular framework for building web applications in Python?",
    options: ["Express.js", "Ruby on Rails", "Django", "ASP.NET"],
    correctAnswer: "Django",
  },
]

export default function SkillAssessmentQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index]) {
        score++
      }
    })
    return (score / questions.length) * 100
  }

  const submitAssessment = async () => {
    setLoading(true)
    const score = calculateScore()

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("No user found")

      const { error } = await supabase
        .from("skill_assessments")
        .insert({
          user_id: user.id,
          assessment_type: "Engineering Fundamentals",
          score: score,
          completed_at: new Date().toISOString(),
        })

      if (error) throw error

      toast({
        title: "Assessment Completed",
        description: `Your score: ${score.toFixed(2)}%`,
      })
    } catch (error) {
      console.error("Error submitting assessment:", error)
      toast({
        title: "Error",
        description: "There was a problem submitting your assessment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Engineering Skills Assessment</CardTitle>
        <CardDescription>Test your knowledge in fundamental engineering concepts</CardDescription>
      </CardHeader>
      <CardContent>
        {!quizCompleted ? (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Question {currentQuestion + 1} of {questions.length}
            </h3>
            <p className="mb-4">{questions[currentQuestion].question}</p>
            <RadioGroup
              value={answers[currentQuestion]}
              onValueChange={handleAnswer}
              className="space-y-2"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={handleNext} className="mt-4">
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </>
        ) : (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Assessment Completed!</h3>
            <p className="mb-4">Your score: {calculateScore().toFixed(2)}%</p>
            <Button onClick={submitAssessment} disabled={loading}>
              {loading ? "Submitting..." : "Submit Assessment"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}