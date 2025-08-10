'use client';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CohortData {
  _id: string;
  cohortCount: number;
}

interface CohortPieChartProps {
  data: CohortData[];
}

export default function CohortPieChart({
  data,
}: CohortPieChartProps) {
  const chartData = {
    labels: data.map((item) =>
      item._id.replace('_', ' ').toUpperCase()
    ),
    datasets: [
      {
        data: data.map((item) => item.cohortCount),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Pie data={chartData} options={options} />
    </div>
  );
}
