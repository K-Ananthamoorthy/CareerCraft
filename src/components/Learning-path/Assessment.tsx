"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface QuizProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    content: {
      questions: {
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
    };
  };
  onComplete: (score: number) => void;
}

export default function AssessmentComponent({ quiz, onComplete }: QuizProps) {
  const [userAnswers, setUserAnswers] = useState<number[]>(new Array(quiz.content.questions.length).fill(-1))
  const [showResults, setShowResults] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    if (!isSubmitted) {
      const newAnswers = [...userAnswers]
      newAnswers[questionIndex] = answerIndex
      setUserAnswers(newAnswers)
    }
  }

  const handleSubmit = () => {
    if (!isSubmitted) {
      try {
        setShowResults(true)
        setIsSubmitted(true)
        const score = userAnswers.reduce((acc, answer, index) => 
          answer === quiz.content.questions[index].correctAnswer ? acc + 1 : acc, 0
        )
        const scorePercentage = Math.round((score / quiz.content.questions.length) * 100)
        console.log('Quiz submitted. Score:', scorePercentage)
        onComplete(scorePercentage)
      } catch (error) {
        console.error('Error submitting quiz:', error)
        toast({
          title: "Error",
          description: "Failed to submit quiz. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const calculateScore = () => {
    const totalQuestions = quiz.content.questions.length
    const correctAnswers = userAnswers.filter((answer, index) => answer === quiz.content.questions[index].correctAnswer).length
    return `${correctAnswers} / ${totalQuestions}`
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">{quiz.title}</h3>
      <p>{quiz.description}</p>
      {quiz.content.questions.map((question, questionIndex) => (
        <div key={questionIndex} className="space-y-2">
          <p className="font-medium">{question.question}</p>
          <RadioGroup
            onValueChange={(value) => handleAnswerChange(questionIndex, parseInt(value))}
            value={userAnswers[questionIndex].toString()}
            disabled={isSubmitted}
          >
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={optionIndex.toString()} 
                  id={`q${questionIndex}-a${optionIndex}`} 
                />
                <Label htmlFor={`q${questionIndex}-a${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
          {showResults && (
            <p className={userAnswers[questionIndex] === question.correctAnswer ? "text-green-500" : "text-red-500"}>
              {userAnswers[questionIndex] === question.correctAnswer ? "Correct!" : "Incorrect. The correct answer was: " + question.options[question.correctAnswer]}
            </p>
          )}
        </div>
      ))}
      {!isSubmitted ? (
        <Button onClick={handleSubmit}>Submit Answers</Button>
      ) : (
        <div>
          <p className="font-semibold">Quiz completed. Your score: {calculateScore()}</p>
        </div>
      )}
    </div>
  )
}

