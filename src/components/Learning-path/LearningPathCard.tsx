import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'
import { Clock, BarChart } from 'lucide-react'

interface LearningPathCardProps {
  id: string
  title: string
  description: string
  duration: string
  level: string
  slug: string
}

export default function LearningPathCard({ id, title, description, duration, level, slug }: LearningPathCardProps) {
  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{duration}</span>
          </div>
          <Badge variant={level === 'Beginner' ? 'secondary' : level === 'Intermediate' ? 'default' : 'destructive'}>
            <BarChart className="w-4 h-4 mr-2" />
            {level}
          </Badge>
        </div>
        <Button asChild className="w-full">
          <Link href={`/learning-paths/${slug}`}>Start Your Journey</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

