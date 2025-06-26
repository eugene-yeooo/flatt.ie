import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useMemo } from 'react'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

type ExpenseCategoryData = {
  category: string
  monthlyAmounts: number[]
}

type ReportsProps = {
  data: ExpenseCategoryData[]
}

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export default function Report({ data }: ReportsProps) {
  // Generate datasets for Chart.js line chart
  const datasets = useMemo(() => {
    // Some nice distinct colors for categories
    const colors = [
      'rgba(75,192,192,1)', // teal
      'rgba(255,99,132,1)', // red
      'rgba(255,206,86,1)', // yellow
      'rgba(54,162,235,1)', // blue
      'rgba(153,102,255,1)', // purple
      'rgba(255,159,64,1)', // orange
    ]

    return data.map((categoryData, index) => ({
      label: categoryData.category,
      data: categoryData.monthlyAmounts,
      fill: false,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.3,
    }))
  }, [data])

  const chartData = {
    labels: monthLabels,
    datasets,
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Expenses by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
  }

  return (
    <div>
      <Line data={chartData} options={options} /> <p>HARD CODED DATA</p>
    </div>
  )
}
