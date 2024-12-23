'use client'

import { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface ChartComponentProps {
  profileData: any
}

export function ChartComponent({ profileData }: ChartComponentProps) {
  const [chartData, setChartData] = useState({
    labels: ['Attendance', 'Test Scores', 'Coding Skills', 'Communication', 'Leadership'],
    datasets: [
      {
        label: 'Academic Performance',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue for Attendance & Test Scores
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false, // No fill for this dataset
        yAxisID: 'y', // Academic Performance dataset on the primary y-axis
      },
      {
        label: 'Extracurricular Skills',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green for Skills
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false, // No fill for this dataset
        yAxisID: 'y1', // Extracurricular dataset on the secondary y-axis
      },
    ],
  })

  useEffect(() => {
    if (profileData) {
      setChartData(prevState => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: [
              profileData.attendanceRate,      // Out of 100
              profileData.averageTestScore,    // Out of 100
              0, 0, 0, // Placeholder for the other dataset (not applicable)
            ],
          },
          {
            ...prevState.datasets[1],
            data: [
              0, 0, // Placeholder for Attendance and Test Scores
              profileData.codingSkillScore,     // Out of 10
              profileData.communicationScore,   // Out of 10
              profileData.leadershipScore,      // Out of 10
            ],
          },
        ],
      }))
    }
  }, [profileData])

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Make it responsive in the container
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 15, // Smaller box for better alignment
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#555',
        borderColor: '#ddd',
        borderWidth: 1,
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw
            return `${tooltipItem.dataset.label}: ${value}`
          },
        },
      },
      title: {
        display: true,
        text: 'Your Performance Overview',
        font: {
          size: 16,
          weight: 'normal',
        },
        color: '#333',
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // For Attendance and Test Scores
        position: 'left',
        grid: {
          drawOnChartArea: false, // Hide grid for the left axis
        },
        ticks: {
          color: 'rgba(54, 162, 235, 1)', // Color for primary axis
        },
        title: {
          display: true,
          text: 'Academic Performance',
          color: '#333',
          font: {
            size: 14,
            weight: 'normal',
          },
        },
      },
      y1: {
        beginAtZero: true,
        max: 10, // For Coding Skills, Communication, and Leadership
        position: 'right',
        grid: {
          drawOnChartArea: false, // Hide grid for the right axis
        },
        ticks: {
          color: 'rgba(75, 192, 192, 1)', // Color for secondary axis
        },
        title: {
          display: true,
          text: 'Extracurricular Skills',
          color: '#333',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
    animation: {
      duration: 1000, // Smooth animation duration
    },
  }

  return (
    <div className="relative h-[400px] w-full">
      <Bar options={options} data={chartData} />
    </div>
  )
}
