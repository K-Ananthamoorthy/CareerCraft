import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Zap, Award, BarChart } from 'lucide-react'

interface AnalysisResultProps {
  analysis: {
    strengths: string[];
    improvements: string[];
    keywords: string[];
    formatting: string[];
    overall_score: number;
    summary: string;
  }
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <BarChart className="w-5 h-5 text-blue-500" />
          <CardTitle>Overall Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{analysis.overall_score}/100</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Award className="w-5 h-5 text-green-500" />
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{analysis.summary}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <CardTitle>Key Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="pl-5 space-y-2 list-disc">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm">{strength}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <CardTitle>Areas for Improvement</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="pl-5 space-y-2 list-disc">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="text-sm">{improvement}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-500" />
          <CardTitle>Key Skills & Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysis.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">{keyword}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-purple-500" />
          <CardTitle>Formatting Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="pl-5 space-y-2 list-disc">
            {analysis.formatting.map((suggestion, index) => (
              <li key={index} className="text-sm">{suggestion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

