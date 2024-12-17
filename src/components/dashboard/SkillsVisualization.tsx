import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface SkillsVisualizationProps {
  skills: {
    extracurricularScore: number
    codingSkillScore: number
    communicationScore: number
    leadershipScore: number
  }
}

export default function SkillsVisualization({ skills }: SkillsVisualizationProps) {
  const data = {
    labels: ['Extracurricular', 'Coding', 'Communication', 'Leadership'],
    datasets: [
      {
        label: 'Skills',
        data: [
          skills.extracurricularScore,
          skills.codingSkillScore,
          skills.communicationScore,
          skills.leadershipScore,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 10
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Skills Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <Radar data={data} options={options} />
          </div>
          <div className="mt-6 space-y-4">
            {Object.entries(skills).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="text-sm font-medium">{value.toFixed(1)}/10</span>
                </div>
                <Progress value={value * 10} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

