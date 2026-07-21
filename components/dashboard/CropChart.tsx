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

const COLORS = ['#2D5016','#5d9e87','#F4A300','#4A7C2C','#0066CC','#E85D6B','#a8c98a','#c97f24']

interface Props {
  labels: string[]
  values: number[]
  type?: 'doughnut' | 'bar'
  horizontal?: boolean
  barColor?: string
}

export default function CropChart({ labels, values, type = 'doughnut', horizontal, barColor }: Props) {
  if (labels.length === 0) {
    return <p style={{ color: '#6b7a5f', fontSize: '0.875rem' }}>No data yet.</p>
  }

  if (type === 'bar') {
    return (
      <Bar
        data={{
          labels,
          datasets: [{
            label: 'Count',
            data: values,
            backgroundColor: barColor ?? COLORS,
            borderWidth: 0,
            borderRadius: 6,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: true,
          indexAxis: horizontal ? 'y' : 'x',
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { font: { weight: 600 } }, grid: { color: horizontal ? 'transparent' : '#f0ede0' } },
            x: { beginAtZero: true, grid: { display: !horizontal }, ticks: { font: { weight: 600 } } },
          },
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
