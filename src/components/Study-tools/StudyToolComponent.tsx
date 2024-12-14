"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool, FileText, Brain, Clock, HelpCircle, BookOpen, Calendar, BookMarked, ArrowLeft, Save, Image } from 'lucide-react'
import { useRouter } from 'next/navigation'
import EssayGradingTool from './Tools/EssayGradingTool'
import PlagiarismCheckTool from './Tools/PlagiarismCheckTool'
import SmartNotesTool from './Tools/SmartNotesTool'
import AISchedulerTool from './Tools/AISchedulerTool'
import ConceptExplainerTool from './Tools/ConceptExplainerTool'
import QuizGeneratorTool from './Tools/QuizGeneratorTool'
import StudyPlanCreatorTool from './Tools/StudyPlanCreatorTool'
import VocabularyBuilderTool from './Tools/VocabularyBuilderTool'
import SavedExplanations from './SavedExplainations'
import React from 'react'

const tasks = [
  { id: 'essay', title: 'Essay Grading', icon: PenTool, color: 'text-pink-500 dark:text-pink-400' },
  { id: 'plagiarism', title: 'Plagiarism Check', icon: FileText, color: 'text-yellow-500 dark:text-yellow-400' },
  { id: 'notes', title: 'Smart Notes', icon: Brain, color: 'text-green-500 dark:text-green-400' },
  { id: 'schedule', title: 'AI Scheduler', icon: Clock, color: 'text-blue-500 dark:text-blue-400' },
  { id: 'explainer', title: 'Concept Explainer', icon: HelpCircle, color: 'text-purple-500 dark:text-purple-400' },
  { id: 'quiz', title: 'Quiz Generator', icon: BookOpen, color: 'text-red-500 dark:text-red-400' },
  { id: 'studyplan', title: 'Study Plan Creator', icon: Calendar, color: 'text-indigo-500 dark:text-indigo-400' },
  { id: 'vocabulary', title: 'Vocabulary Builder', icon: BookMarked, color: 'text-teal-500 dark:text-teal-400' },
]

const TaskButton = React.memo(({ task, onClick }: { task: typeof tasks[0], onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Button
      variant="outline"
      className="flex flex-col items-center justify-center w-full h-full gap-2 py-6 hover:bg-secondary"
      onClick={onClick}
    >
      <task.icon className={`h-8 w-8 ${task.color}`} />
      <span className="text-sm font-medium text-center">{task.title}</span>
    </Button>
  </motion.div>
))

TaskButton.displayName = 'TaskButton'

export default function StudyToolsContent() {
  const [activeTask, setActiveTask] = useState<string | null>(null)
  const router = useRouter()

  const renderActiveTask = useMemo(() => {
    switch (activeTask) {
      case 'essay': return <EssayGradingTool />
      case 'plagiarism': return <PlagiarismCheckTool />
      case 'notes': return <SmartNotesTool />
      case 'schedule': return <AISchedulerTool />
      case 'explainer': return <ConceptExplainerTool />
      case 'quiz': return <QuizGeneratorTool />
      case 'studyplan': return <StudyPlanCreatorTool />
      case 'vocabulary': return <VocabularyBuilderTool />
      case 'saved': return <SavedExplanations />
      default: return null
    }
  }, [activeTask])

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!activeTask && (
          <>
            <motion.div
              key="saved-outputs"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-4"
            >
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setActiveTask('saved')}
              >
                <Save className="w-5 h-5" />
                <span>Saved Outputs</span>
              </Button>
            </motion.div>
            <motion.div
              key="task-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {tasks.map((task) => (
                <TaskButton key={task.id} task={task} onClick={() => setActiveTask(task.id)} />
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8"
            >
              <Card className="text-white bg-gradient-to-r from-purple-500 to-pink-500">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">New! AI Image Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Unlock the power of AI to analyze and understand images. Get detailed descriptions, identify objects, and ask questions about any image!</p>
                  <Button 
                    onClick={() => router.push('/ai-image-analyzer')}
                    variant="secondary"
                    className="text-purple-600 bg-white hover:bg-purple-100"
                  >
                    Try AI Image Analyzer
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-white bg-gradient-to-r from-purple-500 to-pink-500">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">New! PDF Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Try the PDF chat tool and get better</p>
                  <Button 
                    onClick={() => router.push('/pdf-chat')}
                    variant="secondary"
                    className="text-purple-600 bg-white hover:bg-purple-100"
                  >
                    PDf chat
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
        {activeTask && (
          <motion.div
            key="active-task"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader className="flex flex-row items-center">
                <Button variant="ghost" size="icon" onClick={() => setActiveTask(null)} className="mr-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <CardTitle>{tasks.find(t => t.id === activeTask)?.title || 'Saved Outputs'}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderActiveTask}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

