import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FaAward, FaChartLine } from 'react-icons/fa'
import { TrendingUp } from 'lucide-react'

export default function PerformanceInsights() {
  // This data should be fetched from your backend
  const insights = {
    overallProgress: 75,
    strengths: ['Data Structures', 'Algorithms', 'Object-Oriented Programming'],
    areasForImprovement: ['Database Management', 'Web Development', 'Machine Learning'],
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between mb-2 text-sm font-medium">
              <span>Overall Progress</span>
              <span>{insights.overallProgress}%</span>
            </div>
            <Progress value={insights.overallProgress} className="w-full h-2" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Strengths</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {insights.strengths.map((strength, index) => (
                <li key={index} className="flex items-center p-2 text-green-800 bg-green-100 rounded-md">
                  <FaAward className="w-4 h-4 mr-2" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-semibold">Areas for Improvement</h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {insights.areasForImprovement.map((area, index) => (
                <li key={index} className="flex items-center p-2 text-yellow-800 bg-yellow-100 rounded-md">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

