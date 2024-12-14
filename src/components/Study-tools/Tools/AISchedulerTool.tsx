"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export default function SimpleAISchedulerTool() {
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
      toast({
        title: "Error",
        description: "Please add at least one task before generating a schedule.",
        variant: "destructive"
      })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI study scheduler specialized in creating optimized schedules for students.
        Create a detailed weekly study schedule for the following tasks:
        ${tasks.join(', ')}

        Consider the following when creating the schedule:
        1. Assume a typical student's schedule with classes and free time.
        2. Balance study time for each task.
        3. Include breaks and time for revision.
        4. Suggest study techniques appropriate for each task.

        Format the schedule as follows:
        1. Brief overview of the weekly strategy
        2. Daily breakdown (Monday to Sunday) with time slots for each task
        3. Study tips and techniques for effective learning
        4. Suggestions for breaks and self-care

        Keep the schedule realistic and easy to follow.
      `);
      const response = await result.response;
      setSchedule(response.text());
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Error",
        description: "An error occurred while generating the schedule. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl p-4 mx-auto space-y-4">
      <h1 className="mb-4 text-2xl font-bold">AI Study Scheduler</h1>
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
      <Button 
        onClick={handleGenerateSchedule} 
        disabled={tasks.length === 0 || isLoading} 
        className="w-full"
      >
        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Generate Schedule
      </Button>
      {schedule && (
        <div className="mt-4">
          <h2 className="mb-2 text-xl font-semibold">Your AI-Generated Schedule:</h2>
          <Textarea 
            value={schedule} 
            readOnly 
            className="w-full p-2 border rounded h-96"
          />
        </div>
      )}
    </div>
  )
}

