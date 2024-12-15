import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen } from 'lucide-react'

interface LearningPathProps {
  enrolledCourses: Array<{ title: string; progress: number }> | undefined
}

export default function LearningPath({ enrolledCourses }: LearningPathProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Path</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {enrolledCourses?.map((course, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <span className="text-sm font-semibold">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

