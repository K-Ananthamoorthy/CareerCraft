"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, Save, Trash2 } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface EssayGrade {
  grade: number;
  overallFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  technicalAccuracy: string;
  relevanceToEngineering: string;
  writingStyle: string;
  recommendations: string[];
}

interface GradedEssay {
  id: string;
  subject: string;
  essay: string;
  grade: EssayGrade;
  timestamp: number;
}

export default function EnhancedEssayGradingTool() {
  const [essay, setEssay] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState<EssayGrade | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [gradedEssays, setGradedEssays] = useState<GradedEssay[]>([])

  useEffect(() => {
    const savedEssays = localStorage.getItem('gradedEssays')
    if (savedEssays) {
      setGradedEssays(JSON.parse(savedEssays))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('gradedEssays', JSON.stringify(gradedEssays))
  }, [gradedEssays])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!essay.trim() || !subject.trim()) {
      toast({ title: "Error", description: "Please enter both the essay and the subject.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI essay grader specialized in grading essays for engineering students. 
        Grade the following essay on the subject of "${subject}" out of 100 points. 
        Provide a detailed analysis considering the following aspects:
        1. Technical accuracy and depth of knowledge
        2. Clarity of expression and logical flow
        3. Relevance to engineering context
        4. Use of examples and case studies
        5. Critical thinking and problem-solving approach
        6. Grammar, syntax, and technical writing skills

        Respond ONLY with a valid JSON object with the following structure, and do not include any markdown formatting or additional text:
        {
          "grade": [numerical grade],
          "overallFeedback": "[2-3 sentences of general feedback]",
          "strengths": [
            "[Strength 1]",
            "[Strength 2]",
            "[Strength 3]"
          ],
          "areasForImprovement": [
            "[Area 1]",
            "[Area 2]",
            "[Area 3]"
          ],
          "technicalAccuracy": "[Comments on technical content]",
          "relevanceToEngineering": "[How well the essay relates to the engineering context]",
          "writingStyle": "[Comments on clarity, structure, and technical writing]",
          "recommendations": [
            "[Recommendation 1]",
            "[Recommendation 2]",
            "[Recommendation 3]"
          ]
        }
        
        Essay Subject: ${subject}
        Essay: ${essay}
      `);
      const response = await result.response;
      const cleanedResponse = response.text().replace(/^```json\n|\n```$/g, '');
      const parsedGrade: EssayGrade = JSON.parse(cleanedResponse);
      setGrade(parsedGrade);

      const newGradedEssay: GradedEssay = {
        id: Date.now().toString(),
        subject,
        essay,
        grade: parsedGrade,
        timestamp: Date.now(),
      }
      setGradedEssays(prev => [...prev, newGradedEssay])

      toast({ title: "Success", description: "Essay graded successfully.", variant: "default" })
    } catch (error) {
      console.error("Error grading essay:", error);
      toast({ title: "Error", description: "An error occurred while grading the essay. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEssay = (id: string) => {
    setGradedEssays(prev => prev.filter(essay => essay.id !== id))
    toast({ title: "Success", description: "Graded essay deleted successfully.", variant: "default" })
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-500"
    if (grade >= 80) return "bg-blue-500"
    if (grade >= 70) return "bg-yellow-500"
    if (grade >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Enhanced Essay Grading Tool</h1>
      <Tabs defaultValue="grade" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grade">Grade Essay</TabsTrigger>
          <TabsTrigger value="history">Grading History</TabsTrigger>
        </TabsList>
        <TabsContent value="grade">
          <Card>
            <CardHeader>
              <CardTitle>Essay Grader</CardTitle>
              <CardDescription>Enter your essay and subject for grading</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Essay Subject:</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Machine Learning in IoT, Sustainable Engineering Practices..."
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="essay">Enter your essay:</Label>
                  <Textarea
                    id="essay"
                    value={essay}
                    onChange={(e) => setEssay(e.target.value)}
                    placeholder="Paste your essay here..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Grade Essay
                </Button>
              </form>
            </CardContent>
          </Card>
          {grade && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Essay Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Progress value={grade.grade} className={`w-full ${getGradeColor(grade.grade)}`} />
                  <span className="font-bold">{grade.grade}/100</span>
                </div>
                <p className="font-semibold">Overall Feedback:</p>
                <p>{grade.overallFeedback}</p>
                <div>
                  <p className="font-semibold">Strengths:</p>
                  <ul className="pl-5 list-disc">
                    {grade.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Areas for Improvement:</p>
                  <ul className="pl-5 list-disc">
                    {grade.areasForImprovement.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Technical Accuracy:</p>
                  <p>{grade.technicalAccuracy}</p>
                </div>
                <div>
                  <p className="font-semibold">Relevance to Engineering:</p>
                  <p>{grade.relevanceToEngineering}</p>
                </div>
                <div>
                  <p className="font-semibold">Writing Style:</p>
                  <p>{grade.writingStyle}</p>
                </div>
                <div>
                  <p className="font-semibold">Recommendations:</p>
                  <ul className="pl-5 list-disc">
                    {grade.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Grading History</CardTitle>
              <CardDescription>View your previously graded essays</CardDescription>
            </CardHeader>
            <CardContent>
              {gradedEssays.length === 0 ? (
                <p>No graded essays found.</p>
              ) : (
                <div className="space-y-4">
                  {gradedEssays.map((gradedEssay) => (
                    <Card key={gradedEssay.id}>
                      <CardHeader>
                        <CardTitle>{gradedEssay.subject}</CardTitle>
                        <CardDescription>Graded on: {new Date(gradedEssay.timestamp).toLocaleString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold">Grade: {gradedEssay.grade.grade}/100</p>
                        <p className="mt-2 font-semibold">Overall Feedback:</p>
                        <p>{gradedEssay.grade.overallFeedback}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="destructive" onClick={() => handleDeleteEssay(gradedEssay.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

