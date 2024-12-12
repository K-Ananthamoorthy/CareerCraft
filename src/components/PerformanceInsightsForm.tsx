'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import ReactMarkdown from 'react-markdown'
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react'

interface FormData {
  age: number
  attendance_rate: number
  average_test_score: number
  extracurricular_score: number
  coding_skill_score: number
  communication_score: number
  leadership_score: number
  internship_experience: number
}

interface PredictionResult {
  initialInsights: {
    predictionScore: number | string
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  enhancedInsights: string
}

export default function PerformanceInsightsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    age: 0,
    attendance_rate: 0,
    average_test_score: 0,
    extracurricular_score: 0,
    coding_skill_score: 0,
    communication_score: 0,
    leadership_score: 0,
    internship_experience: 0
  })
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPredictionResult(null)
    setError(null)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to fetch prediction')
      }

      const data = await response.json()
      setPredictionResult(data)
    } catch (error) {
      console.error('Prediction error:', error)
      setError((error as Error).message || "Failed to make prediction. Please try again.")
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to make prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatPredictionScore = (score: number | string): number => {
    const numScore = typeof score === 'string' ? parseFloat(score) : score;
    return isNaN(numScore) ? 0 : Math.min(Math.max(numScore, 0), 100);
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Get Your Performance Insights</CardTitle>
        <CardDescription>Fill in the form below to get personalized insights about your academic performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Label>
                <Input
                  id={key}
                  name={key}
                  type="number"
                  value={value}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating Insights..." : "Get Insights"}
          </Button>
        </form>

        {error && (
          <div className="p-4 mt-6 text-red-700 bg-red-100 rounded-md">
            <h3 className="font-semibold">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {predictionResult && (
          <div className="mt-8">
            <h3 className="mb-4 text-2xl font-semibold">Your Performance Insights</h3>
            <Tabs defaultValue="initial" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="initial">Initial Insights</TabsTrigger>
                <TabsTrigger value="enhanced">Enhanced Insights</TabsTrigger>
              </TabsList>
              <TabsContent value="initial" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <h4 className="mb-2 text-lg font-semibold">Predicted Performance Score</h4>
                      <div className="flex items-center">
                        <Progress 
                          value={parseFloat(formatPredictionScore(predictionResult.initialInsights.predictionScore))} 
                          max={100}
                          className="w-full mr-4" 
                        />
                        <span className="text-2xl font-bold">
                          {formatPredictionScore(predictionResult.initialInsights.predictionScore).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h5 className="flex items-center mb-2 font-semibold">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          Strengths
                        </h5>
                        <ul className="space-y-2">
                          {predictionResult.initialInsights.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <ArrowRight className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-green-500" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="flex items-center mb-2 font-semibold">
                          <XCircle className="w-5 h-5 mr-2 text-red-500" />
                          Areas for Improvement
                        </h5>
                        <ul className="space-y-2">
                          {predictionResult.initialInsights.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start">
                              <ArrowRight className="flex-shrink-0 w-4 h-4 mt-1 mr-2 text-red-500" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h5 className="mb-2 font-semibold">Recommendations</h5>
                      <ul className="space-y-2">
                        {predictionResult.initialInsights.recommendations.map((recommendation, index) => (
                          <li key={index} className="p-3 rounded-md bg-blue-50">
                            <p className="text-blue-700">{recommendation}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="enhanced" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <ReactMarkdown 
                      className="prose max-w-none"
                      components={{
                        h1: ({node, ...props}) => <h1 className="mb-4 text-2xl font-bold" {...props} />,
                        h2: ({node, ...props}) => <h2 className="mt-6 mb-3 text-xl font-semibold" {...props} />,
                        h3: ({node, ...props}) => <h3 className="mt-4 mb-2 text-lg font-semibold" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4" {...props} />,
                        ul: ({node, ...props}) => <ul className="pl-5 mb-4 list-disc" {...props} />,
                        ol: ({node, ...props}) => <ol className="pl-5 mb-4 list-decimal" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        blockquote: ({node, ...props}) => <blockquote className="pl-4 my-4 italic border-l-4 border-gray-300" {...props} />,
                      }}
                    >
                      {predictionResult.enhancedInsights}
                    </ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-6"
          onClick={() => router.push('/profile')}
        >
          Back to Profile
        </Button>
      </CardContent>
    </Card>
  )
}

