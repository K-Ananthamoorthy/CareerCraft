import ResumeAnalyzer from '@/components/resume/ResumeAnalyzer'

export default function ResumeAnalyzerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container px-4 py-16 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-center text-gray-800 dark:text-white">AI-Powered Resume Analyzer</h1>
        <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
          Upload your resume and get instant feedback to improve your chances of landing your dream job.
        </p>
        <ResumeAnalyzer />
      </div>
    </div>
  )
}

