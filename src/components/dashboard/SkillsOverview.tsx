import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

interface SkillsOverviewProps {
  skills: {
    extracurricularScore: number
    codingSkillScore: number
    communicationScore: number
    leadershipScore: number
  } | undefined
}

export default function SkillsOverview({ skills }: SkillsOverviewProps) {
  const data = {
    labels: ['Extracurricular', 'Coding', 'Communication', 'Leadership'],
    datasets: [
      {
        label: 'Skills',
        data: skills ? [
          skills.extracurricularScore,
          skills.codingSkillScore,
          skills.communicationScore,
          skills.leadershipScore,
        ] : [],
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
    },
    maintainAspectRatio: false
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Skills Overview</h2>
      <div className="h-64">
        <Radar data={data} options={options} />
      </div>
    </div>
  )
}

