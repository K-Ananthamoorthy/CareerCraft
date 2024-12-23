'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import LearningPathForm from './LearningPathForm'
import ModuleForm from './ModuleForm'
import QuizForm from './QuizForm'

interface LearningPath {
  id: string
  title: string
  description: string
  duration: string
  level: string
  slug: string
}

interface Module {
  id: string
  learning_path_id: string
  title: string
  description: string
  order_index: number
}

interface Quiz {
  id: string
  module_id: string
  title: string
  description: string
  content: {
    questions: Array<{
      id: string
      question: string
      options: string[]
      correctAnswer: number
    }>
  }
}

export default function LearningPathsAdminPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [modules, setModules] = useState<{ [key: string]: Module[] }>({})
  const [quizzes, setQuizzes] = useState<{ [key: string]: Quiz[] }>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<string>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [dialogConfig, setDialogConfig] = useState<{
    type: 'path' | 'module' | 'quiz' | null
    isOpen: boolean
    editingData: any
  }>({
    type: null,
    isOpen: false,
    editingData: null
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchLearningPaths()
  }, [])

  useEffect(() => {
    if (selectedPathId) {
      fetchModules(selectedPathId)
    }
  }, [selectedPathId])

  useEffect(() => {
    if (selectedModuleId) {
      fetchQuizzes(selectedModuleId)
    }
  }, [selectedModuleId])

  useEffect(() => {
    if (selectedPathId && modules[selectedPathId]) {
      modules[selectedPathId].forEach(module => {
        fetchQuizzes(module.id)
      })
    }
  }, [modules, selectedPathId])

  const filteredPaths = learningPaths.filter(path => 
    path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    path.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  async function fetchLearningPaths() {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .order('title')
      
      if (error) throw error
      setLearningPaths(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch learning paths",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchModules(pathId: string) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('learning_path_id', pathId)
        .order('order_index')
      
      if (error) throw error
      setModules(prev => ({ ...prev, [pathId]: data || [] }))
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch modules",
        variant: "destructive",
      })
    }
  }

  async function fetchQuizzes(moduleId: string) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_id', moduleId)
      
      if (error) throw error
      setQuizzes(prev => ({ ...prev, [moduleId]: data || [] }))
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (type: 'path' | 'module' | 'quiz', data: any) => {
    try {
      let result
      switch (type) {
        case 'path':
          if (dialogConfig.editingData) {
            result = await supabase
              .from('learning_paths')
              .update(data)
              .eq('id', dialogConfig.editingData.id)
          } else {
            result = await supabase
              .from('learning_paths')
              .insert([data])
          }
          await fetchLearningPaths()
          break

        case 'module':
          if (dialogConfig.editingData) {
            result = await supabase
              .from('modules')
              .update(data)
              .eq('id', dialogConfig.editingData.id)
          } else {
            result = await supabase
              .from('modules')
              .insert([{ ...data, learning_path_id: selectedPathId }])
          }
          if (selectedPathId) await fetchModules(selectedPathId)
          break

        case 'quiz':
          if (dialogConfig.editingData) {
            result = await supabase
              .from('quizzes')
              .update(data)
              .eq('id', dialogConfig.editingData.id)
          } else {
            result = await supabase
              .from('quizzes')
              .insert([{ ...data, module_id: selectedModuleId }])
          }
          if (selectedModuleId) await fetchQuizzes(selectedModuleId)
          break
      }

      if (result?.error) throw result.error
      
      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} ${dialogConfig.editingData ? 'updated' : 'created'} successfully`,
      })
      
      setDialogConfig({ type: null, isOpen: false, editingData: null })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Failed to ${dialogConfig.editingData ? 'update' : 'create'} ${type}`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (type: 'path' | 'module' | 'quiz', id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return
    
    try {
      const { error } = await supabase
        .from(type === 'path' ? 'learning_paths' : type === 'module' ? 'modules' : 'quizzes')
        .delete()
        .eq('id', id)
      
      if (error) throw error

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      })

      switch (type) {
        case 'path':
          fetchLearningPaths()
          if (selectedPathId === id) setSelectedPathId(null)
          break
        case 'module':
          if (selectedPathId) fetchModules(selectedPathId)
          break
        case 'quiz':
          if (selectedModuleId) fetchQuizzes(selectedModuleId)
          break
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Failed to delete ${type}`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container px-2 py-4 mx-auto md:py-6 md:px-4 max-w-7xl">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 md:gap-6">
        {/* Sidebar */}
        <div className="h-full space-y-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Learning Paths</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setDialogConfig({ type: 'path', isOpen: true, editingData: null })}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute w-4 h-4 left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search paths..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="space-y-2">
                  {filteredPaths.map((path) => (
                    <Card
                      key={path.id}
                      className={`cursor-pointer transition-colors hover:bg-muted ${
                        selectedPathId === path.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedPathId(path.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium leading-none">{path.title}</h3>
                            <p className="text-sm text-muted-foreground">{path.level}</p>
                          </div>
                          <BookOpen className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9">
          {selectedPathId && learningPaths.map((path) => {
            if (path.id !== selectedPathId) return null;

            return (
              <Card key={path.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>{path.title}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">{path.description}</p>
                      <div className="flex gap-4 mt-2">
                        <span className="text-sm">Duration: {path.duration}</span>
                        <span className="text-sm">Level: {path.level}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDialogConfig({
                          type: 'path',
                          isOpen: true,
                          editingData: path
                        })}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete('path', path.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="modules">Modules</TabsTrigger>
                      <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          <div>
                            <Label>Path Details</Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Slug: {path.slug}
                            </p>
                          </div>
                          <div>
                            <Label>Module Count</Label>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {modules[path.id]?.length || 0} modules
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="modules">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Modules</h3>
                          <Button
                            size="sm"
                            onClick={() => setDialogConfig({
                              type: 'module',
                              isOpen: true,
                              editingData: null
                            })}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Module
                          </Button>
                        </div>
                        <div className="grid gap-4">
                          {modules[path.id]?.map((module, index) => (
                            <Card key={module.id}>
                              <CardContent className="p-4">
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                  <div>
                                    <h4 className="font-medium">
                                      {index + 1}. {module.title}
                                    </h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      {module.description}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedModuleId(module.id)
                                        setDialogConfig({
                                          type: 'module',
                                          isOpen: true,
                                          editingData: module
                                        })
                                      }}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDelete('module', module.id)}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                </div>
                                {quizzes[module.id]?.length > 0 && (
                                  <div className="pl-4 mt-4 border-l-2">
                                    <Label className="text-sm">Quizzes</Label>
                                    <div className="mt-2 space-y-2">
                                      {quizzes[module.id].map((quiz) => (
                                        <div
                                          key={quiz.id}
                                          className="flex items-center justify-between p-2 rounded-md bg-muted"
                                        >
                                          <span className="text-sm">{quiz.title}</span>
                                          <div className="flex gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() => {
                                                setSelectedModuleId(module.id)
                                                setDialogConfig({
                                                  type: 'quiz',
                                                  isOpen: true,
                                                  editingData: quiz
                                                })
                                              }}
                                            >
                                              <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="text-destructive"
                                              onClick={() => handleDelete('quiz', quiz.id)}
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-4"
                                  onClick={() => {
                                    setSelectedModuleId(module.id)
                                    setDialogConfig({
                                      type: 'quiz',
                                      isOpen: true,
                                      editingData: null
                                    })
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Quiz
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="quizzes">
                      <div className="space-y-4">
                        {modules[path.id]?.map((module) => (
                          <Card key={module.id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{module.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {quizzes[module.id]?.length > 0 ? (
                                  quizzes[module.id].map((quiz) => (
                                    <Card key={quiz.id}>
                                      <CardContent className="p-4">
                                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                          <div>
                                            <h4 className="font-medium">{quiz.title}</h4>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                              {quiz.description}
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                              {quiz.content.questions.length} questions
                                            </p>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                setSelectedModuleId(module.id)
                                                setDialogConfig({
                                                  type: 'quiz',
                                                  isOpen: true,
                                                  editingData: quiz
                                                })
                                              }}
                                            >
                                              <Edit className="w-4 h-4 mr-2" />
                                              Edit
                                            </Button>
                                            <Button
                                              variant="destructive"
                                              size="sm"
                                              onClick={() => handleDelete('quiz', quiz.id)}
                                            >
                                              <Trash2 className="w-4 h-4 mr-2" />
                                              Delete
                                            </Button>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">
                                    No quizzes available for this module
                                  </p>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedModuleId(module.id)
                                    setDialogConfig({
                                      type: 'quiz',
                                      isOpen: true,
                                      editingData: null
                                    })
                                  }}
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Quiz
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog
        open={dialogConfig.isOpen}
        onOpenChange={(isOpen) => 
          setDialogConfig(prev => ({ ...prev, isOpen }))
        }
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogConfig.editingData ? 'Edit' : 'Create'} {(dialogConfig.type ?? '').charAt(0).toUpperCase() + (dialogConfig.type ?? '').slice(1)}
            </DialogTitle>
          </DialogHeader>
          {dialogConfig.type === 'path' && (
            <LearningPathForm
              initialData={dialogConfig.editingData}
              onSubmit={(data) => handleSubmit('path', data)}
              onCancel={() => setDialogConfig({ type: null, isOpen: false, editingData: null })}
            />
          )}
          {dialogConfig.type === 'module' && (
            <ModuleForm
              initialData={dialogConfig.editingData}
              onSubmit={(data) => handleSubmit('module', data)}
              onCancel={() => setDialogConfig({ type: null, isOpen: false, editingData: null })}
            />
          )}
          {dialogConfig.type === 'quiz' && (
            <QuizForm
              initialData={dialogConfig.editingData}
              onSubmit={(data) => handleSubmit('quiz', data)}
              onCancel={() => setDialogConfig({ type: null, isOpen: false, editingData: null })}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

