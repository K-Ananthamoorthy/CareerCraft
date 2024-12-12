import { Metadata } from "next"
import PerformanceInsightsForm from "@/components/PerformanceInsightsForm"

export const metadata: Metadata = {
  title: "Get Performance Insights | AI-Powered Learning Platform",
  description: "Get personalized insights about your academic performance",
}

export default function InsightsPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center">Get Your Performance Insights</h1>
      <PerformanceInsightsForm />
    </div>
  )
}

