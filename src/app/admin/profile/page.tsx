"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { StudentDashboard } from './content'

interface StudentProfile {
  id: string;
  fullName: string;
  avatarUrl: string;
  attendanceRate: number;
  averageTestScore: number;
  extracurricularScore: number;
  behaviorScore: number;
  leadershipScore: number;
  communicationScore: number;
  projectScore: number;
  codingSkillScore: number;
  engineeringBranch: string;
  collegeYear: number;
}

export default function DashboardPage() {
  const [profilesData, setProfilesData] = useState<StudentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchProfilesData() {
      try {
        const { data, error } = await supabase
          .from('student_profiles')
          .select('*')
          .order('fullName', { ascending: true })

        if (error) throw error

        setProfilesData(data)
      } catch (e) {
        setError('Failed to load profile data')
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchProfilesData()
  }, [supabase])

  if (loading) return <div className="p-4 text-center">Loading...</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>
  if (!profilesData.length) return <div className="p-4 text-center">No profile data available</div>

  return <StudentDashboard profilesData={profilesData} />
}

