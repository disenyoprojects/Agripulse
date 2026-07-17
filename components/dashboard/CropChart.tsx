'use client'

import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const COLORS = ['#2D5016','#F4A300','#4A7C2C','#A8C686','#0066CC','#E85D6B','#3FAE95','#D6E85C']

interface Props {
  labels: string[]
  values: number[]
  type?: 'doughnut' | 'bar'
}

export default function CropChart({ labels, values, type = 'doughnut' }: Props) {
  if (labels.length === 0) {
    return <p style={{ color: '#6b7a5f', fontSize: '0.875rem' }}>No data yet.</p>
  }

  if (type === 'bar') {
    return (
      <Bar
        data={{
          labels,
          datasets: [{
            label: 'Submissions',
            data: values,
            backgroundColor: COLORS,
            borderWidth: 0,
            borderRadius: 6,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0ede0' } }, x: { grid: { display: false } } },
        }}
      />
    )
  }

  return (
    <Doughnut
      data={{
        labels,
        datasets: [{
          data: values,
          backgroundColor: COLORS,
          borderWidth: 2,
          borderColor: '#FAF6F0',
        }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { font: { size: 11 }, padding: 12 },
          },
        },
      }}
    />
  )
}
