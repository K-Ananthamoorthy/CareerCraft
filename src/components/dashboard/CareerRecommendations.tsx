import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, ChevronRight } from 'lucide-react'

export default function CareerRecommendations() {
  // This data should be fetched from your backend
  const recommendations = [
    { title: 'Software Engineer', match: 95 },
    { title: 'Data Scientist', match: 88 },
    { title: 'Cloud Architect', match: 82 },
    { title: 'AI/ML Engineer', match: 79 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Career Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-2">
            {recommendations.map((career, index) => (
              <li key={index} className="flex items-center justify-between p-3 transition-colors rounded-md bg-secondary hover:bg-secondary/80">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="font-medium">{career.title}</span>
                </div>
                <span className="text-sm font-semibold text-green-600">{career.match}% Match</span>
              </li>
            ))}
          </ul>
          <Button className="w-full group" onClick={() => window.location.href = '/career-recommendations'}>
            Explore Career Paths
            <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

