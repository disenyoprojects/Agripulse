'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend)

interface Props {
  labels: string[]
  values: number[]
}

export default function WeeklyChart({ labels, values }: Props) {
  return (
    <Line
      data={{
        labels,
        datasets: [{
          label: 'Submissions',
          data: values,
          borderColor: '#F4A300',
          backgroundColor: 'rgba(244,163,0,0.15)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#F4A300',
          pointRadius: 4,
        }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      }}
    />
  )
}
