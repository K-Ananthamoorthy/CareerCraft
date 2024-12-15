"use client"

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

interface Certificate {
  id: string
  user_id: string
  learning_path_id: string
  issued_at: string
  learning_path: {
    title: string
  }
  user: {
    name: string
  }
}

export default function CertificatePage({ params }: { params: { id: string } }) {
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function fetchCertificate() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          learning_path:learning_paths(title),
          user:users(name)
        `)
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching certificate:', error)
        router.push('/404')
      } else {
        setCertificate(data)
      }

      setIsLoading(false)
    }

    fetchCertificate()
  }, [params.id, supabase, router])

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!certificate) {
    return <div className="flex items-center justify-center h-screen">Certificate not found</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-10 mx-auto"
    >
      <div className="max-w-2xl p-8 mx-auto border-4 border-gray-800 rounded-lg">
        <h1 className="mb-6 text-4xl font-bold text-center">Certificate of Completion</h1>
        <p className="mb-4 text-xl text-center">This is to certify that</p>
        <p className="mb-4 text-3xl font-bold text-center">{certificate.user.name}</p>
        <p className="mb-4 text-xl text-center">has successfully completed the course</p>
        <p className="mb-6 text-3xl font-bold text-center">{certificate.learning_path.title}</p>
        <p className="mb-8 text-xl text-center">
          Issued on {new Date(certificate.issued_at).toLocaleDateString()}
        </p>
        <div className="flex justify-center">
          <Button onClick={() => window.print()}>Print Certificate</Button>
        </div>
      </div>
    </motion.div>
  )
}

