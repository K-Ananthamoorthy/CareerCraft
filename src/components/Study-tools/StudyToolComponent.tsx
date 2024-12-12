"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenTool, FileText, Brain, Clock, HelpCircle, BookOpen, Calendar, BookMarked, ArrowLeft, Save } from 'lucide-react'
import EssayGradingTool from './Tools/EssayGradingTool'
import PlagiarismCheckTool from './Tools/PlagiarismCheckTool'
import SmartNotesTool from './Tools/SmartNotesTool'
import AISchedulerTool from './Tools/AISchedulerTool'
import ConceptExplainerTool from './Tools/ConceptExplainerTool'
import QuizGeneratorTool from './Tools/QuizGeneratorTool'
import StudyPlanCreatorTool from './Tools/StudyPlanCreatorTool'
import VocabularyBuilderTool from './Tools/VocabularyBuilderTool'
import SavedExplanations from './SavedExplainations'

const tasks = [
  { id: 'essay', title: 'Essay Grading', icon: PenTool, color: 'text-pink-500 dark:text-pink-400' },
  { id: 'plagiarism', title: 'Plagiarism Check', icon: FileText, color: 'text-yellow-500 dark:text-yellow-400' },
  { id: 'notes', title: 'Smart Notes', icon: Brain, color: 'text-green-500 dark:text-green-400' },
  { id: 'schedule', title: 'AI Scheduler', icon: Clock, color: 'text-blue-500 dark:text-blue-400' },
  { id: 'explainer', title: 'Concept Explainer', icon: HelpCircle, color: 'text-purple-500 dark:text-purple-400' },
  { id: 'quiz', title: 'Quiz Generator', icon: BookOpen, color: 'text-red-500 dark:text-red-400' },
  { id: 'studyplan', title: 'Study Plan Creator', icon: Calendar, color: 'text-indigo-500 dark:text-indigo-400' },
  { id: 'vocabulary', title: 'Vocabulary Builder', icon: BookMarked, color: 'text-teal-500 dark:text-teal-400' },
  { id: 'saved', title: 'Saved Outputs', icon: Save, color: 'text-green-600 dark:text-green-500' },
]

export default function StudyToolsContent() {
  const [activeTask, setActiveTask] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!activeTask ? (
          <motion.div
            key="task-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className="flex flex-col items-center justify-center w-full h-full gap-2 py-6 hover:bg-secondary"
                  onClick={() => setActiveTask(task.id)}
                >
                  <task.icon className={`h-8 w-8 ${task.color}`} />
                  <span className="text-sm font-medium text-center">{task.title}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
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
                <CardTitle>{tasks.find(t => t.id === activeTask)?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {activeTask === 'essay' && <EssayGradingTool />}
                {activeTask === 'plagiarism' && <PlagiarismCheckTool />}
                {activeTask === 'notes' && <SmartNotesTool />}
                {activeTask === 'schedule' && <AISchedulerTool />}
                {activeTask === 'explainer' && <ConceptExplainerTool />}
                {activeTask === 'quiz' && <QuizGeneratorTool />}
                {activeTask === 'studyplan' && <StudyPlanCreatorTool />}
                {activeTask === 'vocabulary' && <VocabularyBuilderTool />}
                {activeTask === 'saved' && <SavedExplanations />}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

