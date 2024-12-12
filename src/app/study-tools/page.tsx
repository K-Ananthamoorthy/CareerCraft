import { Metadata } from "next"
import StudyToolsContent from "@/components/Study-tools/StudyToolComponent"

export const metadata: Metadata = {
  title: "AI-Powered Study Tools | Learning Platform",
  description: "Access a suite of AI-powered study tools to enhance your learning experience.",
}

export default function StudyToolsPage() {
  return (
    <div className="container px-4 py-10 mx-auto">
      <h1 className="mb-6 text-3xl font-bold text-primary">AI-Powered Study Tools</h1>
      <StudyToolsContent />
    </div>
  )
}

