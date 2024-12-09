"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface Certificate {
  id: string;
  user_id: string;
  learning_path_id: string;
  issued_at: string;
}

interface LearningPath {
  id: string;
  title: string;
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: certData, error: certError } = await supabase
        .from('certifications')
        .select('*')
        .eq('learning_path_id', params.id)
        .eq('user_id', user.id)
        .single()

      if (certError) {
        console.error('Error fetching certificate:', certError)
        router.push('/404')
        return
      }

      setCertificate(certData)

      const { data: pathData, error: pathError } = await supabase
        .from('learning_paths')
        .select('id, title')
        .eq('id', params.id)
        .single()

      if (pathError) {
        console.error('Error fetching learning path:', pathError)
      } else {
        setLearningPath(pathData)
      }

      setIsLoading(false)
    }

    fetchData()
  }, [params.id, supabase, router])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!certificate || !learningPath) {
    return <div className="flex items-center justify-center h-screen">Certificate not found</div>
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10 mx-auto text-center"
    >
      <h1 className="mb-6 text-4xl font-bold">Certificate of Completion</h1>
      <p className="mb-4 text-xl">This certifies that</p>
      <p className="mb-4 text-2xl font-semibold">[Your Name]</p>
      <p className="mb-4 text-xl">has successfully completed the course</p>
      <p className="mb-6 text-3xl font-bold">{learningPath.title}</p>
      <p className="mb-8 text-xl">Issued on: {new Date(certificate.issued_at).toLocaleDateString()}</p>
      <Button onClick={() => window.print()}>Print Certificate</Button>
    </motion.div>
  )
}

