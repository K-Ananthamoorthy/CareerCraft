"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export default function AISchedulerTool() {
  const [tasks, setTasks] = useState<string[]>([])
  const [newTask, setNewTask] = useState('')
  const [schedule, setSchedule] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()])
      setNewTask('')
    }
  }

  const handleGenerateSchedule = async () => {
    if (tasks.length === 0) {
      toast({ title: "Error", description: "Please add at least one task before generating a schedule.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI study scheduler specialized in creating optimized schedules for engineering students in India.
        Create a detailed study schedule for the following tasks, considering the typical academic environment and challenges faced by Indian engineering students:
        ${tasks.join(', ')}

        Consider the following aspects when creating the schedule:
        1. Typical class hours and academic workload in Indian engineering colleges
        2. Preparation for regular exams, projects, and competitive exams (e.g., GATE)
        3. Balancing theoretical study with practical/lab work
        4. Incorporating time for self-study, group study, and doubt-clearing sessions
        5. Accounting for extracurricular activities and personal time

        Format the schedule as follows:
        1. Overall time estimate and study strategy
        2. Daily breakdown with specific time slots for each task (Monday to Sunday)
        3. Weekly goals and milestones
        4. Suggestions for breaks, revision sessions, and time management
        5. Tips for staying focused and motivated in the Indian academic context
        6. Recommendations for additional resources or study materials

        Ensure the schedule is realistic, balanced, and tailored to the needs of an Indian engineering student.
      `);
      const response = await result.response;
      setSchedule(response.text());
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({ title: "Error", description: "An error occurred while generating the schedule. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTask} className="flex space-x-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task or subject..."
          className="flex-grow"
        />
        <Button type="submit">Add</Button>
      </form>
      <ul className="pl-5 space-y-1 list-disc">
        {tasks.map((task, index) => (
          <li key={index}>{task}</li>
        ))}
      </ul>
      <Button onClick={handleGenerateSchedule} disabled={tasks.length === 0 || isLoading} className="w-full">
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Generate Schedule
      </Button>
      {schedule && (
        <div className="p-4 mt-4 rounded-md bg-secondary">
          <h3 className="mb-2 text-lg font-semibold">Your AI-Generated Schedule:</h3>
          <pre className="text-sm whitespace-pre-wrap">{schedule}</pre>
        </div>
      )}
    </div>
  )
}
