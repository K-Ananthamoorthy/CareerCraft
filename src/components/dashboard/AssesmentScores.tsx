"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const assessmentScores = [
  { assessment: "Engineering Fundamentals", score: 85 },
  { assessment: "Data Structures & Algorithms", score: 72 },
  { assessment: "Web Technologies", score: 90 },
  { assessment: "Database Systems", score: 78 },
  { assessment: "Software Engineering", score: 88 },
]

export default function AssessmentScores() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Scores</CardTitle>
        <CardDescription>Your performance in recent assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: {
              label: "Score",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={assessmentScores}>
            <XAxis
              dataKey="assessment"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.split(' ')[0]}
            />
            <YAxis tickLine={false} axisLine={false} />
            <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
            <ChartTooltip content={<ChartTooltipContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}