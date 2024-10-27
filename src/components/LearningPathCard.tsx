import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

interface LearningPathCardProps {
  title: string
  description: string
  duration: string
  level: string
  slug: string
}

export default function LearningPathCard({ title, description, duration, level, slug }: LearningPathCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <span>Duration: {duration}</span>
          <span>Level: {level}</span>
        </div>
        <Button asChild className="w-full">
          <Link href={`#${slug}`}>Start Learning</Link>
        </Button>
      </CardContent>
    </Card>
  )
}