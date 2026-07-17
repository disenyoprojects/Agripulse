'use client'

import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  values: number[]
}

export default function CropChart({ labels, values }: Props) {
  if (labels.length === 0) {
    return <p className="text-sm text-[#6b7a5f]">No data yet.</p>
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Submissions',
        data: values,
        backgroundColor: '#F4A300',
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f0ede0' }, ticks: { stepSize: 1 } },
    },
  }

  return <Bar data={data} options={options} />
}
