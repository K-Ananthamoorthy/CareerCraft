import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const skillsData = [
  { skill: "Programming", score: 75 },
  { skill: "Data Structures", score: 60 },
  { skill: "Algorithms", score: 65 },
  { skill: "Web Development", score: 80 },
  { skill: "Database Management", score: 70 },
]

export default function SkillsOverview() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Skills Overview</CardTitle>
        <CardDescription>Based on your assessments and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skillsData.map((skill) => (
            <div key={skill.skill}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">{skill.skill}</span>
                <span className="text-sm font-medium text-primary">{skill.score}%</span>
              </div>
              <Progress value={skill.score} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}