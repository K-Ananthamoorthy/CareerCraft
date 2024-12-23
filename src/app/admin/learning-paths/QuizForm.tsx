import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizFormProps {
  initialData?: {
    title: string
    description: string
    content: {
      questions: Question[]
    }
  } | null
  onSubmit: (data: {
    title: string
    description: string
    content: {
      questions: Question[]
    }
  }) => void
  onCancel: () => void
}

export default function QuizForm({
  initialData,
  onSubmit,
  onCancel
}: QuizFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    content: {
      questions: []
    }
  })

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: [...prev.content.questions, newQuestion]
      }
    }))
  }

  const removeQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.filter(q => q.id !== questionId)
      }
    }))
  }

  const updateQuestion = (questionId: string, field: keyof Question, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.map(q =>
          q.id === questionId ? { ...q, [field]: value } : q
        )
      }
    }))
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.map(q =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((opt, idx) =>
                  idx === optionIndex ? value : opt
                )
              }
            : q
        )
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Quiz Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Questions</Label>
          <Button type="button" onClick={addQuestion} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        <div className="space-y-4">
          {formData.content.questions.map((question, qIndex) => (
            <Card key={question.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                  <div className="flex-1 w-full space-y-2">
                    <Label htmlFor={`question-${question.id}`}>
                      Question {qIndex + 1}
                    </Label>
                    <Textarea
                      id={`question-${question.id}`}
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(question.id, 'question', e.target.value)
                      }
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  <Label>Options (Select the correct answer)</Label>
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          value={option}
                          onChange={(e) =>
                            updateOption(question.id, oIndex, e.target.value)
                          }
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === oIndex}
                          onChange={() =>
                            updateQuestion(question.id, 'correctAnswer', oIndex)
                          }
                          required
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-muted-foreground">
                          Correct
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update' : 'Create'} Quiz
        </Button>
      </div>
    </form>
  )
}

