'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Category {
  id: number
  name: string
}

interface Assessment {
  id: number
  category_id: number
  title: string
  description: string
  duration: string
  total_questions: number
  max_attempts: number
}

interface Question {
  id: number
  assessment_id: number
  question_text: string
  question_type: string
  correct_answer: string
  points: number
  difficulty: string
}

export default function AssessmentsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false)
  
  const emptyAssessment: Omit<Assessment, 'id'> = {
    category_id: selectedCategory || 0,
    title: '',
    description: '',
    duration: '01:00',
    total_questions: 10,
    max_attempts: 2
  }

  const [assessmentForm, setAssessmentForm] = useState(emptyAssessment)
  
  const [newQuestion, setNewQuestion] = useState<Omit<Question, 'id'>>({
    assessment_id: 0,
    question_text: '',
    question_type: 'multiple_choice',
    correct_answer: '',
    points: 1,
    difficulty: 'medium'
  })
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchAssessments(selectedCategory)
    }
  }, [selectedCategory])

  async function fetchCategories() {
    try {
      const { data, error } = await supabase.from('categories').select('*')
      if (error) throw error
      setCategories(data)
      if (data.length > 0) {
        setSelectedCategory(data[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      })
    }
  }

  async function fetchAssessments(categoryId: number) {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('category_id', categoryId)
      
      if (error) throw error
      setAssessments(data || [])

      if (data && data.length > 0) {
        fetchQuestions(data[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assessments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  async function fetchQuestions(assessmentId: number) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('assessment_id', assessmentId)
      
      if (error) throw error
      setQuestions(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch questions",
        variant: "destructive",
      })
    }
  }

  const handleEditAssessment = (assessment: Assessment) => {
    setIsEditing(true)
    setEditingAssessment(assessment)
    setAssessmentForm(assessment)
    setShowAssessmentDialog(true)
  }

  async function handleAssessmentSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (isEditing && editingAssessment) {
        const { error } = await supabase
          .from('assessments')
          .update(assessmentForm)
          .eq('id', editingAssessment.id)
        
        if (error) throw error
        toast({ title: "Success", description: "Assessment updated successfully" })
      } else {
        const { error } = await supabase
          .from('assessments')
          .insert([{ ...assessmentForm, category_id: selectedCategory }])
        
        if (error) throw error
        toast({ title: "Success", description: "Assessment created successfully" })
      }
      
      setShowAssessmentDialog(false)
      setIsEditing(false)
      setEditingAssessment(null)
      setAssessmentForm(emptyAssessment)
      if (selectedCategory) {
        fetchAssessments(selectedCategory)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save assessment",
        variant: "destructive",
      })
    }
  }

  async function deleteAssessment(id: number) {
    try {
      const { error } = await supabase
        .from('assessments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      toast({ title: "Success", description: "Assessment deleted successfully" })
      if (selectedCategory) {
        fetchAssessments(selectedCategory)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment",
        variant: "destructive",
      })
    }
  }

  async function createQuestion(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAssessment) return
    
    try {
      const { data, error } = await supabase
        .from('questions')
        .insert([{ ...newQuestion, assessment_id: selectedAssessment.id }])
        .select()
      
      if (error) throw error
      
      toast({ title: "Success", description: "Question created successfully" })
      fetchQuestions(selectedAssessment.id)
      setNewQuestion({
        assessment_id: selectedAssessment.id,
        question_text: '',
        question_type: 'multiple_choice',
        correct_answer: '',
        points: 1,
        difficulty: 'medium'
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive",
      })
    }
  }

  async function deleteQuestion(id: number) {
    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      toast({ title: "Success", description: "Question deleted successfully" })
      if (selectedAssessment) {
        fetchQuestions(selectedAssessment.id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      })
    }
  }

  const AssessmentForm = () => (
    <form onSubmit={handleAssessmentSubmit} className="space-y-4">
      <Input
        placeholder="Title"
        value={assessmentForm.title}
        onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
        required
      />
      <Textarea
        placeholder="Description"
        value={assessmentForm.description}
        onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
        required
      />
      <Input
        type="time"
        value={assessmentForm.duration}
        onChange={(e) => setAssessmentForm({ ...assessmentForm, duration: e.target.value })}
        required
      />
      <Input
        type="number"
        placeholder="Total Questions"
        value={assessmentForm.total_questions}
        onChange={(e) => setAssessmentForm({ ...assessmentForm, total_questions: Number(e.target.value) })}
        required
        min={1}
      />
      <Input
        type="number"
        placeholder="Max Attempts"
        value={assessmentForm.max_attempts}
        onChange={(e) => setAssessmentForm({ ...assessmentForm, max_attempts: Number(e.target.value) })}
        required
        min={1}
      />
      <Button type="submit">
        {isEditing ? 'Update Assessment' : 'Create Assessment'}
      </Button>
    </form>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessments Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Select
              value={selectedCategory?.toString()}
              onValueChange={(value) => setSelectedCategory(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Assessments</h2>
            <Button onClick={() => {
              setIsEditing(false)
              setEditingAssessment(null)
              setAssessmentForm(emptyAssessment)
              setShowAssessmentDialog(true)
            }}>
              Add New Assessment
            </Button>
          </div>

          <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {isEditing ? 'Edit Assessment' : 'Create New Assessment'}
                </DialogTitle>
              </DialogHeader>
              <AssessmentForm />
            </DialogContent>
          </Dialog>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-4">
              {assessments.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No assessments found for this category. Create one to get started.
                </p>
              ) : (
                <Tabs 
                  defaultValue={assessments[0]?.id.toString()}
                  onValueChange={(value) => {
                    const assessment = assessments.find(a => a.id.toString() === value)
                    setSelectedAssessment(assessment || null)
                    if (assessment) {
                      fetchQuestions(assessment.id)
                    }
                  }}
                >
                  <TabsList className="w-full">
                    {assessments.map((assessment) => (
                      <TabsTrigger key={assessment.id} value={assessment.id.toString()}>
                        {assessment.title}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {assessments.map((assessment) => (
                    <TabsContent key={assessment.id} value={assessment.id.toString()}>
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{assessment.title}</h3>
                            <p className="text-sm text-gray-500">{assessment.description}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">Duration: {assessment.duration}</p>
                              <p className="text-sm">Total Questions: {assessment.total_questions}</p>
                              <p className="text-sm">Max Attempts: {assessment.max_attempts}</p>
                            </div>
                          </div>
                          <div className="space-x-2">
                            <Button 
                              variant="outline"
                              onClick={() => handleEditAssessment(assessment)}
                            >
                              Edit Assessment
                            </Button>
                            <Button 
                              variant="destructive"
                              onClick={() => deleteAssessment(assessment.id)}
                            >
                              Delete Assessment
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-lg font-semibold">Questions</h4>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button>Add Question</Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add New Question</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={createQuestion} className="space-y-4">
                                  <Textarea
                                    placeholder="Question Text"
                                    value={newQuestion.question_text}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
                                    required
                                  />
                                  <Select
                                    value={newQuestion.question_type}
                                    onValueChange={(value) => setNewQuestion({ ...newQuestion, question_type: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Question Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                      <SelectItem value="true_false">True/False</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    placeholder="Correct Answer"
                                    value={newQuestion.correct_answer}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, correct_answer: e.target.value })}
                                    required
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Points"
                                    value={newQuestion.points}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
                                    required
                                    min={1}
                                  />
                                  <Select
                                    value={newQuestion.difficulty}
                                    onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="easy">Easy</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button type="submit">Add Question</Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Question</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Correct Answer</TableHead>
                                <TableHead>Points</TableHead>
                                <TableHead>Difficulty</TableHead>
                                <TableHead>Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {questions.map((question) => (
                                <TableRow key={question.id}>
                                  <TableCell>{question.question_text}</TableCell>
                                  <TableCell>{question.question_type}</TableCell>
                                  <TableCell>{question.correct_answer}</TableCell>
                                  <TableCell>{question.points}</TableCell>
                                  <TableCell>{question.difficulty}</TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => deleteQuestion(question.id)}
                                    >
                                      Delete
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}