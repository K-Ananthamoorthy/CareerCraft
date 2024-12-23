'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { ChartComponent } from '@/components/dashboard/ChartComponent'
import { NotesComponent } from '@/components/dashboard/NotesComponent'
import { Sparkles, CalendarIcon, PenTool } from 'lucide-react'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState<any>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile, error } = await supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

          if (error) throw error
          setProfileData(profile)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container p-4 mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        {profileData?.avatarUrl ? (
          <motion.img
            src={profileData.avatarUrl}
            alt="Profile Picture"
            className="w-24 h-24 border-4 border-white rounded-full shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="flex items-center justify-center w-24 h-24 font-bold text-white bg-gray-300 rounded-full">
            A
          </div>
        )}
        <motion.h1
          className="mt-4 text-4xl font-bold text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome, {profileData?.fullName || user?.user_metadata?.full_name || 'Student'}!
        </motion.h1>
        <p className="mt-2 text-xl text-muted-foreground">
          Let's make today productive!
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Calendar Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="mr-2" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" className="border rounded-md" />
          </CardContent>
        </Card>

        {/* Performance Insights Card */}
        <Card className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent profileData={profileData} />
          </CardContent>
        </Card>

        {/* Quick Notes Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenTool className="mr-2" />
              Quick Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <NotesComponent userId={user?.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
