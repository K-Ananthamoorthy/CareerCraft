'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Upload } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import AnalysisResult from './AnalysisResult'
import FileUploader from './FileUploader'

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (uploadedFile: File | null) => {
    setFile(uploadedFile)
    setAnalysis(null)
  }

  const handleAnalyze = async () => {
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Server response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Oops! Received non-JSON response from server")
      }

      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error analyzing resume:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze the resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-6 space-y-6">
        <FileUploader onFileChange={handleFileChange} />
        {file && (
          <div className="text-sm text-gray-500">
            Selected file: {file.name}
          </div>
        )}
        <Button 
          onClick={handleAnalyze} 
          disabled={isLoading || !file} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Analyze Resume
            </>
          )}
        </Button>
        {analysis && <AnalysisResult analysis={analysis} />}
      </CardContent>
    </Card>
  )
}

