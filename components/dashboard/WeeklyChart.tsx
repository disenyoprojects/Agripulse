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
          backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; chartArea?: { top: number; bottom: number } } }) => {
            const { chart } = ctx
            if (!chart.chartArea) return 'rgba(244,163,0,0.12)'
            const gradient = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom)
            gradient.addColorStop(0, 'rgba(244,163,0,0.22)')
            gradient.addColorStop(1, 'rgba(244,163,0,0.02)')
            return gradient
          },
          fill: true,
          tension: 0.42,
          borderWidth: 2.5,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#F4A300',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#F4A300',
        }],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1, font: { size: 11 }, color: '#8a917e' },
            grid: { color: 'rgba(16,25,11,0.06)' },
            border: { display: false },
          },
          x: {
            ticks: { font: { size: 11 }, color: '#8a917e' },
            grid: { display: false },
            border: { display: false },
          },
        },
      }}
    />
  )
}
