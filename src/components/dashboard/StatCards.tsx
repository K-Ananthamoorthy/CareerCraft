import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, TrendingUp, Award, Calendar } from 'lucide-react'

interface StatCardsProps {
  dashboardData: {
    totalCourses: number
    averageScore: number
    studyStreak: number
    upcomingEvents: number
  } | null
}

export default function StatCards({ dashboardData }: StatCardsProps) {
  const stats = [
    { title: "Total Courses", value: dashboardData?.totalCourses, icon: BookOpen },
    { title: "Average Score", value: `${dashboardData?.averageScore}%`, icon: TrendingUp },
    { title: "Study Streak", value: `${dashboardData?.studyStreak} days`, icon: Award },
    { title: "Upcoming Events", value: dashboardData?.upcomingEvents, icon: Calendar },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

