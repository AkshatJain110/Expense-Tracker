import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// need to register these or chart.js won't work
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function SpendingChart({ summaryData }) {
  if (!summaryData || summaryData.length === 0) {
    return <p className="empty-msg">Add some expenses to see the chart.</p>
  }

  const labels = summaryData.map((item) => item.category)
  const values = summaryData.map((item) => item.total)

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Spent (₹)',
        data: values,
        backgroundColor: [
          '#4f46e5', '#7c3aed', '#db2777', '#ea580c',
          '#16a34a', '#0891b2', '#ca8a04',
        ],
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Spending by Category',
        font: { size: 16 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (val) => '₹' + val,
        },
      },
    },
  }

  return (
    <div className="chart-wrapper">
      <Bar data={data} options={options} />
    </div>
  )
}

export default SpendingChart
