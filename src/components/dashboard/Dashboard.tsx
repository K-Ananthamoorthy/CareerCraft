"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from "@/hooks/use-toast"
import DashboardHeader from './DashboardHeader'
import SkillsOverview from './SkillsOverview'
import PerformanceChart from './PerformanceChart'
import CourseProgress from './CourseProgress'
import Calendar from './Calendar'
import AchievementCards from './AchievementCards'
import AssessmentScoreVisualization from './AssessmentScoreVisualization'
import LoadingSpinner from '@/components/LoadingSpinner'

interface UserProfile {
  fullName: string
  avatarUrl: string
  engineeringBranch: string
}

interface DashboardData {
  skills: {
    extracurricularScore: number
    codingSkillScore: number
    communicationScore: number
    leadershipScore: number
  }
  performanceHistory: Array<{ date: string; score: number }>
  enrolledCourses: Array<{ title: string; progress: number }>
  achievements: Array<{ title: string; description: string; icon: string }>
}

export default function EnhancedDashboard() {
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
          .select('fullName, avatarUrl, engineeringBranch, extracurricularScore, codingSkillScore, communicationScore, leadershipScore')
          .eq('user_id', user.id)
          .single()

        if (profileError) throw profileError

        setUserProfile({
          fullName: profile.fullName,
          avatarUrl: profile.avatarUrl,
          engineeringBranch: profile.engineeringBranch
        })

        // Fetch performance history
        const { data: performanceHistory, error: performanceError } = await supabase
          .from('student_performance')
          .select('date, score')
          .eq('user_id', user.id)
          .order('date', { ascending: true })

        if (performanceError) throw performanceError

        // Fetch enrolled courses
        const { data: enrolledCourses, error: coursesError } = await supabase
          .from('enrolled_courses')
          .select('title, progress')
          .eq('user_id', user.id)

        if (coursesError) throw coursesError

        // Fetch achievements
        const { data: achievements, error: achievementsError } = await supabase
          .from('student_achievements')
          .select('title, description, icon')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6)

        if (achievementsError) throw achievementsError

        setDashboardData({
          skills: {
            extracurricularScore: profile.extracurricularScore,
            codingSkillScore: profile.codingSkillScore,
            communicationScore: profile.communicationScore,
            leadershipScore: profile.leadershipScore
          },
          performanceHistory,
          enrolledCourses,
          achievements
        })
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
    return <LoadingSpinner />
  }

  return (
    <div className="container px-4 py-8 mx-auto space-y-8">
      <DashboardHeader userProfile={userProfile} />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <SkillsOverview skills={dashboardData?.skills} />
        <PerformanceChart performanceHistory={dashboardData?.performanceHistory} />
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <CourseProgress enrolledCourses={dashboardData?.enrolledCourses} />
        <Calendar />
      </div>
      <AssessmentScoreVisualization />
      <AchievementCards achievements={dashboardData?.achievements} />
    </div>
  )
}

