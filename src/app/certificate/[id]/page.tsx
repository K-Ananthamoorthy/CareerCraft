"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Share2 } from 'lucide-react'
import Certificate from '@/components/Learning-path/Certificate'
import { useToast } from "@/hooks/use-toast"
import html2canvas from 'html2canvas'

interface CertificateData {
  id: string
  user_id: string
  learning_path_id: string
  issued_at: string
}

interface LearningPath {
  id: string
  title: string
}

interface StudentProfile {
  id: string
  user_id: string
  fullName: string
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCertificateData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: certData, error: certError } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', params.id)
          .single()

        if (certError) throw certError

        setCertificateData(certData)

        const { data: pathData, error: pathError } = await supabase
          .from('learning_paths')
          .select('id, title')
          .eq('id', certData.learning_path_id)
          .single()

        if (pathError) throw pathError

        setLearningPath(pathData)

        const { data: profileData, error: profileError } = await supabase
          .from('student_profiles')
          .select('id, user_id, fullName')
          .eq('user_id', user.id)
          .single()

        if (profileError) throw profileError

        setStudentProfile(profileData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching certificate data:', error)
        toast({
          title: "Error",
          description: "Failed to load certificate. Please try again.",
          variant: "destructive",
        })
        router.push('/404')
      }
    }

    fetchCertificateData()
  }, [params.id, supabase, router, toast])

  const handleDownload = async () => {
    const certificateElement = document.getElementById('certificate')
    if (!certificateElement) return

    try {
      const canvas = await html2canvas(certificateElement)
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `CareerCrafters_Certificate_${params.id}.png`
      link.click()

      toast({
        title: "Success",
        description: "Certificate downloaded successfully!",
      })
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast({
        title: "Error",
        description: "Failed to download certificate. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    const certificateElement = document.getElementById('certificate')
    if (!certificateElement) return

    try {
      const canvas = await html2canvas(certificateElement)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve))
      if (!blob) {
        throw new Error('Failed to create blob from canvas')
      }
      const file = new File([blob], 'CareerCrafters_Certificate.png', { type: 'image/png' })
      
      const shareUrl = `https://careercrafters.vercel.app/certificate/${params.id}`
      const shareText = `I'm excited to share that I've completed the "${learningPath?.title}" course at CareerCrafters! 🎉🚀\n\nThis course has equipped me with valuable skills and knowledge in ${learningPath?.title}. I'm grateful for the opportunity to learn and grow with CareerCrafters.\n\nIf you're looking to enhance your skills, I highly recommend checking out CareerCrafters. Start your learning journey today!\n\nView my certificate: ${shareUrl}`
      
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'My CareerCrafters Course Certificate',
          text: shareText,
          url: shareUrl
        })

        toast({
          title: "Success",
          description: "Certificate shared successfully!",
        })
      } else {
        // Fallback for browsers that don't support native sharing
        await navigator.clipboard.writeText(shareText)
        handleDownload()
        toast({
          title: "Success",
          description: "Share text copied to clipboard and certificate downloaded.",
        })
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
      toast({
        title: "Error",
        description: "Failed to share certificate. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 rounded-full border-t-transparent animate-spin" />
          <p className="text-lg font-medium text-blue-800">Preparing your CareerCrafters certificate...</p>
        </div>
      </div>
    )
  }

  if (!certificateData || !learningPath || !studentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-medium text-red-600">Certificate not found</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10 mx-auto"
    >
      <Card className="w-full max-w-5xl p-8 mx-auto bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <h1 className="text-3xl font-bold text-blue-800">Your CareerCrafters Certificate</h1>
            <div className="flex space-x-4">
              <Button onClick={handleDownload} variant="outline" className="bg-white hover:bg-blue-50">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleShare} className="text-white bg-blue-600 hover:bg-blue-700">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-white rounded-lg shadow-lg" id="certificate">
            <Certificate
              userName={studentProfile.fullName}
              courseName={learningPath.title}
              issueDate={new Date(certificateData.issued_at).toLocaleDateString()}
            />
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-700">
              Congratulations on completing your course! Share your achievement and inspire others to start their learning journey with CareerCrafters.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

