"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

interface PlagiarismResult {
  likelihood: number;
  analysis: string;
  suspiciousElements: string[];
  potentialSources: string[];
  recommendations: string[];
}

export default function EnhancedPlagiarismCheckTool() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<PlagiarismResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [checkHistory, setCheckHistory] = useState<{ text: string; result: PlagiarismResult }[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      toast({ title: "Error", description: "Please enter text to check for plagiarism.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(`
        You are an AI plagiarism checker specialized in analyzing text for potential plagiarism.
        Analyze the following text for potential plagiarism, considering common academic and online sources.
        Provide a detailed report on the likelihood of plagiarism, mentioning any suspicious patterns or content.
        Consider the following aspects:
        1. Similarity to common textbooks, academic papers, and online resources
        2. Presence of technical jargon or explanations that seem too advanced for the typical student level
        3. Inconsistencies in writing style or sudden changes in language complexity
        4. Presence of specific examples or case studies that might be copied from other sources

        Respond ONLY with a valid JSON object with the following structure, and do not include any markdown formatting or additional text:
        {
          "likelihood": [percentage estimate as a number between 0 and 100],
          "analysis": "[2-3 sentences explaining the overall analysis]",
          "suspiciousElements": [
            "[Point 1]",
            "[Point 2]",
            "[Point 3]"
          ],
          "potentialSources": [
            "[Suspected source 1]",
            "[Suspected source 2]"
          ],
          "recommendations": [
            "[Suggestion 1 for improving originality]",
            "[Suggestion 2 for improving originality]",
            "[Suggestion 3 for improving originality]"
          ]
        }

        Text to analyze: ${text}
      `);
      const response = await result.response;
      const cleanedResponse = response.text().replace(/^```json\n|\n```$/g, '');
      const parsedResult: PlagiarismResult = JSON.parse(cleanedResponse);
      setResult(parsedResult);
      setCheckHistory(prev => [...prev, { text, result: parsedResult }]);
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast({ title: "Error", description: "An error occurred while checking for plagiarism. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const getLikelihoodColor = (likelihood: number) => {
    if (likelihood < 30) return "bg-green-500"
    if (likelihood < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Enhanced Plagiarism Check Tool</h1>
      <Tabs defaultValue="check" className="space-y-4">
        <TabsList>
          <TabsTrigger value="check">Check Plagiarism</TabsTrigger>
          <TabsTrigger value="history">Check History</TabsTrigger>
        </TabsList>
        <TabsContent value="check">
          <Card>
            <CardHeader>
              <CardTitle>Plagiarism Checker</CardTitle>
              <CardDescription>Enter your text to check for potential plagiarism</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plagiarism-text">Text to check:</Label>
                  <Textarea
                    id="plagiarism-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your text here to check for plagiarism..."
                    className="min-h-[200px]"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Check Plagiarism
                </Button>
              </form>
            </CardContent>
          </Card>
          {result && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Plagiarism Check Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Progress value={result.likelihood} className={`w-full ${getLikelihoodColor(result.likelihood)}`} />
                  <span className="font-bold">{result.likelihood}%</span>
                </div>
                <p>{result.analysis}</p>
                <div>
                  <h4 className="mb-2 font-semibold">Suspicious Elements:</h4>
                  <ul className="pl-5 list-disc">
                    {result.suspiciousElements.map((element, index) => (
                      <li key={index}>{element}</li>
                    ))}
                  </ul>
                </div>
                {result.potentialSources.length > 0 && (
                  <div>
                    <h4 className="mb-2 font-semibold">Potential Sources:</h4>
                    <ul className="pl-5 list-disc">
                      {result.potentialSources.map((source, index) => (
                        <li key={index}>{source}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="mb-2 font-semibold">Recommendations:</h4>
                  <ul className="pl-5 list-disc">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index}>{recommendation}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                {result.likelihood < 30 ? (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Low plagiarism risk
                  </div>
                ) : result.likelihood < 70 ? (
                  <div className="flex items-center text-yellow-500">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Moderate plagiarism risk
                  </div>
                ) : (
                  <div className="flex items-center text-red-500">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    High plagiarism risk
                  </div>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Check History</CardTitle>
              <CardDescription>View your previous plagiarism check results</CardDescription>
            </CardHeader>
            <CardContent>
              {checkHistory.length === 0 ? (
                <p>No previous checks found.</p>
              ) : (
                <div className="space-y-4">
                  {checkHistory.map((check, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>Check #{index + 1}</CardTitle>
                        <CardDescription>Plagiarism Likelihood: {check.result.likelihood}%</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold">Analyzed Text:</p>
                        <p className="text-sm text-gray-500 truncate">{check.text}</p>
                        <p className="mt-2 font-semibold">Analysis:</p>
                        <p>{check.result.analysis}</p>
                      </CardContent>
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

