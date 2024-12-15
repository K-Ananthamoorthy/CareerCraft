"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionIndex] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setShowResults(true)
    const score = userAnswers.reduce((acc, answer, index) => 
      answer === quiz.content.questions[index].correctAnswer ? acc + 1 : acc, 0
    )
    onComplete(score)
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
          >
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={optionIndex.toString()} id={`q${questionIndex}-a${optionIndex}`} />
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
      {!showResults && (
        <Button onClick={handleSubmit}>Submit Answers</Button>
      )}
    </div>
  )
}

