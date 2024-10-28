'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LoadingSpinner from '@/components/LoadingSpinner' // Import the loading spinner

export default function PrivacyPolicy() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate a delay for loading
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We collect information you provide directly to us, such as when you create an account, 
                participate in assessments, or communicate with us. This may include your name, email address, 
                educational background, and performance data.
              </p>
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We use the information we collect to provide, maintain, and improve our services, 
                including personalizing your learning experience, offering career recommendations, 
                and analyzing platform usage to enhance our offerings.
              </p>
            </CardContent>
          </Card>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>4. Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                You have the right to access, correct, or delete your personal information. You may also 
                have the right to restrict or object to certain processing of your data. To exercise these 
                rights, please contact us at privacy@ailearningplatform.com.
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
