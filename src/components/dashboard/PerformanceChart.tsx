import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface PerformanceChartProps {
  performanceHistory: Array<{ date: string; score: number }> | undefined
}

export default function PerformanceChart({ performanceHistory }: PerformanceChartProps) {
  const data = {
    labels: performanceHistory?.map(item => item.date) || [],
    datasets: [
      {
        label: 'Performance Score',
        data: performanceHistory?.map(item => item.score) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance Over Time'
      }
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Performance Trend</h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  )
}

