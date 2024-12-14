"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Trash2, Edit, Eye } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface Question {
  text: string;
  type: 'Multiple Choice' | 'Short Answer' | 'Numerical';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  topic: string;
  questions: Question[];
  createdAt: number;
}

export default function EnhancedQuizGeneratorTool() {
  const [topic, setTopic] = useState('')
  const [numQuestions, setNumQuestions] = useState('5')
  const [difficulty, setDifficulty] = useState<'Mixed' | 'Easy' | 'Medium' | 'Hard'>('Mixed')
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  useEffect(() => {
    const savedQuizzes = localStorage.getItem('generatedQuizzes')
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('generatedQuizzes', JSON.stringify(quizzes))
  }, [quizzes])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      toast({ title: "Error", description: "Please enter a topic for the quiz.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI quiz generator specialized in creating quizzes for engineering students.
        Create a quiz on the following topic:
        Topic: ${topic}
        Number of questions: ${numQuestions}
        Difficulty: ${difficulty}

        Generate a quiz with the following characteristics:
        1. Mix of multiple-choice, short-answer, and numerical problem-solving questions
        2. Questions should be of ${difficulty === 'Mixed' ? 'varying difficulty levels (easy, medium, hard)' : `${difficulty.toLowerCase()} difficulty`}
        3. Clear and concise questions that test both theoretical knowledge and practical application
        4. Questions that align with engineering curriculum and exam patterns
        5. Inclusion of questions that relate to industry standards and practices
        6. Correct answers provided for each question
        7. Brief explanations for the correct answers, including relevant formulas or concepts

        Respond ONLY with a valid JSON object with the following structure, and do not include any markdown formatting or additional text:
        {
          "topic": "${topic}",
          "questions": [
            {
              "text": "Question text",
              "type": "Multiple Choice" or "Short Answer" or "Numerical",
              "difficulty": "Easy" or "Medium" or "Hard",
              "options": ["A) Option A", "B) Option B", "C) Option C", "D) Option D"] (only for Multiple Choice),
              "correctAnswer": "Correct answer or letter for multiple choice",
              "explanation": "Brief explanation of the correct answer"
            },
            ...
          ]
        }
      `);
      const response = await result.response;
      const cleanedResponse = response.text().replace(/^```json\n|\n```$/g, '');
      const parsedQuiz: Quiz = JSON.parse(cleanedResponse);
      const newQuiz: Quiz = {
        ...parsedQuiz,
        id: Date.now().toString(),
        createdAt: Date.now(),
      };
      setQuiz(newQuiz);
      setQuizzes(prev => [...prev, newQuiz]);
      toast({ title: "Success", description: "Quiz generated successfully.", variant: "default" })
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({ title: "Error", description: "An error occurred while generating the quiz. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteQuiz = (id: string) => {
    setQuizzes(prev => prev.filter(q => q.id !== id))
    toast({ title: "Success", description: "Quiz deleted successfully.", variant: "default" })
  }

  const renderQuiz = (quiz: Quiz) => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">{quiz.topic}</h3>
      {quiz.questions.map((question, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Question {index + 1}</CardTitle>
            <CardDescription>Type: {question.type} | Difficulty: {question.difficulty}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{question.text}</p>
            {question.type === 'Multiple Choice' && (
              <ul className="pl-5 mt-2 list-disc">
                {question.options?.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
            )}
            <p className="mt-2"><span className="font-semibold">Correct Answer:</span> {question.correctAnswer}</p>
            <p className="mt-2"><span className="font-semibold">Explanation:</span> {question.explanation}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Enhanced Quiz Generator Tool</h1>
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Quiz</TabsTrigger>
          <TabsTrigger value="manage">Manage Quizzes</TabsTrigger>
        </TabsList>
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Generator</CardTitle>
              <CardDescription>Enter details to generate a new quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Quiz Topic:</Label>
                  <Input
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Digital Electronics, Thermodynamics, Data Structures..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numQuestions">Number of Questions:</Label>
                  <Input
                    id="numQuestions"
                    type="number"
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    min="1"
                    max="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty:</Label>
                  <Select value={difficulty} onValueChange={(value: 'Mixed' | 'Easy' | 'Medium' | 'Hard') => setDifficulty(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mixed">Mixed</SelectItem>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Generate Quiz
                </Button>
              </form>
            </CardContent>
          </Card>
          {quiz && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Generated Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                {renderQuiz(quiz)}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Quizzes</CardTitle>
              <CardDescription>View and manage your generated quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {quizzes.length === 0 ? (
                <p>No quizzes generated yet.</p>
              ) : (
                <div className="space-y-4">
                  {quizzes.map((q) => (
                    <Card key={q.id}>
                      <CardHeader>
                        <CardTitle>{q.topic}</CardTitle>
                        <CardDescription>Created on: {new Date(q.createdAt).toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Number of questions: {q.questions.length}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> View</Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{q.topic}</DialogTitle>
                              <DialogDescription>Created on: {new Date(q.createdAt).toLocaleString()}</DialogDescription>
                            </DialogHeader>
                            {renderQuiz(q)}
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" onClick={() => handleDeleteQuiz(q.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

