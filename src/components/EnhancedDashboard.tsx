"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, BookOpen, Calendar, GraduationCap, Trophy, Users } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  fullName: string
  avatarUrl: string
}

interface DashboardData {
  totalCourses: number
  averageScore: number
  studyStreak: number
  upcomingEvents: number
  nextEventDate: string
  courseProgress: Array<{ title: string; progress: number }>
  recentActivities: Array<{ type: string; title: string; date: string; status?: string }>
}

export default function ProfessionalDashboard() {
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
          .select('fullName, avatarUrl')
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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="container p-4 mx-auto space-y-6">
      <motion.div
        className="flex flex-col items-center justify-between p-6 bg-white rounded-lg shadow-md md:flex-row"
        {...fadeInUp}
      >
        <div className="flex items-center mb-4 space-x-4 md:mb-0">
          <Avatar className="w-16 h-16 border-2 border-primary">
            <AvatarImage src={userProfile?.avatarUrl || "/placeholder.svg"} />
            <AvatarFallback>{userProfile?.fullName.charAt(0) || 'S'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {userProfile?.fullName || 'Student'}!</h1>
            <p className="text-muted-foreground">Let's check your progress</p>
          </div>
        </div>
     </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Enrolled courses
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Avg. Score</CardTitle>
              <BarChart className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.averageScore}%</div>
              <Progress value={dashboardData?.averageScore} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.studyStreak} days</div>
              <p className="text-xs text-muted-foreground">
                Keep it up!
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData?.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Next: {dashboardData?.nextEventDate}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="assignments">Assignments</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
              {['courses', 'assignments', 'discussions'].map((activityType) => (
                <TabsContent key={activityType} value={activityType}>
                  <ul className="space-y-2">
                    {dashboardData?.recentActivities
                      .filter((activity) => activity.type === activityType)
                      .map((activity, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{activity.title}</span>
                          <span className="text-sm text-muted-foreground">
                            {activity.type === 'assignment' ? activity.status : activity.date}
                          </span>
                        </li>
                      ))}
                  </ul>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.courseProgress.map((course, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span>{course.title}</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...fadeInUp} transition={{ delay: 0.7 }}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Button className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
              <Button className="w-full" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Join Study Group
              </Button>
              <Button className="w-full" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Session
              </Button>
              <Button className="w-full" variant="outline">
                <GraduationCap className="w-4 h-4 mr-2" />
                View Certificates
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container p-4 mx-auto space-y-6">
      <div className="flex flex-col items-center justify-between p-6 bg-white rounded-lg shadow-md md:flex-row">
        <div className="flex items-center mb-4 space-x-4 md:mb-0">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="w-48 h-8 mb-2" />
            <Skeleton className="w-32 h-4" />
          </div>
        </div>
        <Skeleton className="w-24 h-10" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-4 h-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-16 h-8 mb-2" />
              <Skeleton className="w-full h-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="w-32 h-6" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-32" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="w-32 h-6" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

