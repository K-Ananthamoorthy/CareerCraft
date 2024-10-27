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
    <Card>
      <CardHeader>
        <CardTitle>Your Skills Overview</CardTitle>
        <CardDescription>Based on your assessments and activities</CardDescription>
      </CardHeader>
      <CardContent>
        {skillsData.map((skill) => (
          <div key={skill.skill} className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{skill.skill}</span>
              <span className="text-sm font-medium">{skill.score}%</span>
            </div>
            <Progress value={skill.score} className="w-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}