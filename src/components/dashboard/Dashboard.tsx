"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/hooks/use-toast"
import WelcomeHeader from './WelcomeHeader'
import StatCards from './StatCards'
import PerformanceInsights from './PerformanceInsights'
import CareerRecommendations from './CareerRecommendations'
import LearningPath from './LearningPath'
import LoadingAnimation from '@/components/LoadingSpinner'

interface UserProfile {
  fullName: string
  avatarUrl: string
  engineeringBranch: string
}

interface DashboardData {
  totalCourses: number
  averageScore: number
  studyStreak: number
  upcomingEvents: number
  enrolledCourses: Array<{ title: string; progress: number }>
}

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("No user found")

        // Fetch user profile
        const { data: profile, error: profileError } = await supabase
          .from('student_profiles')
          .select('fullName, avatarUrl, engineeringBranch')
          .eq('user_id', user.id)
          .single()

        if (profileError) throw profileError

        setUserProfile(profile)

        // Fetch dashboard data
        const { data, error } = await supabase
          .rpc('get_student_dashboard_data', { user_id: user.id })

        if (error) throw error

        setDashboardData(data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [supabase, toast])

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <motion.div 
      className="container p-4 mx-auto space-y-8 sm:p-6 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <WelcomeHeader userProfile={userProfile} />
      <StatCards dashboardData={dashboardData} />
      <div className="grid gap-8 md:grid-cols-2">
        <PerformanceInsights />
        <CareerRecommendations />
      </div>
      <LearningPath enrolledCourses={dashboardData?.enrolledCourses} />
    </motion.div>
  )
}

