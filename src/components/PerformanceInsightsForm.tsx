'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PerformanceInsightsForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    age: 0,
    attendance_rate: 0,
    average_test_score: 0,
    extracurricular_score: 0,
    coding_skill_score: 0,
    communication_score: 0,
    leadership_score: 0,
    internship_experience: 0
  })
  interface PredictionResult {
    prediction: number;
    insights: {
      Strengths: string[];
      Weaknesses: string[];
      Recommendations: string[];
    };
  }

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed')
      }

      setPredictionResult(data)
    } catch (error) {
      console.error('Prediction error:', error)
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to make prediction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Get Your Performance Insights</CardTitle>
        <CardDescription>Fill in the form below to get personalized insights about your academic performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance_rate">Attendance Rate (%)</Label>
              <Input
                id="attendance_rate"
                name="attendance_rate"
                type="number"
                value={formData.attendance_rate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="average_test_score">Average Test Score</Label>
              <Input
                id="average_test_score"
                name="average_test_score"
                type="number"
                value={formData.average_test_score}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extracurricular_score">Extracurricular Score</Label>
              <Input
                id="extracurricular_score"
                name="extracurricular_score"
                type="number"
                value={formData.extracurricular_score}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coding_skill_score">Coding Skill Score</Label>
              <Input
                id="coding_skill_score"
                name="coding_skill_score"
                type="number"
                value={formData.coding_skill_score}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="communication_score">Communication Score</Label>
              <Input
                id="communication_score"
                name="communication_score"
                type="number"
                value={formData.communication_score}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadership_score">Leadership Score</Label>
              <Input
                id="leadership_score"
                name="leadership_score"
                type="number"
                value={formData.leadership_score}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="internship_experience">Internship Experience (months)</Label>
              <Input
                id="internship_experience"
                name="internship_experience"
                type="number"
                value={formData.internship_experience}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Generating Insights..." : "Get Insights"}
          </Button>
        </form>

        {predictionResult && (
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-semibold">Your Performance Insights</h3>
            <p className="text-lg">Predicted Performance Score: <span className="font-bold">{predictionResult.prediction.toFixed(2)}</span></p>
            
            <div>
              <h4 className="font-semibold text-green-600">Strengths:</h4>
              <ul className="pl-5 list-disc">
                {predictionResult.insights.Strengths.map((strength, index) => (
                  <li key={index}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-600">Areas for Improvement:</h4>
              <ul className="pl-5 list-disc">
                {predictionResult.insights.Weaknesses.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-600">Recommendations:</h4>
              <ul className="pl-5 list-disc">
                {predictionResult.insights.Recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Button 
          type="button" 
          variant="outline" 
          className="w-full mt-4"
          onClick={() => router.push('/profile')}
        >
          Back to Profile
        </Button>
      </CardContent>
    </Card>
  )
}

