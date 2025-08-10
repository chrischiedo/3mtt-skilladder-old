'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CAREER_LABELS: { [key: string]: string } = {
  ds: 'Data Science',
  ai: 'AI/ML',
  anim: 'Animation',
  cyber: 'Cybersecurity',
  pm: 'Product Management',
  devops: 'DevOps',
  qa: 'Quality Assurance',
  gd: 'Game Development',
  sd: 'Software Development',
  uiux: 'UI/UX Design',
  da: 'Data Analysis',
  cc: 'Cloud Computing',
};

interface CareerData {
  _id: string;
  totalNumberOfFellows: number;
}

interface CareerBarChartProps {
  data: CareerData[];
}

export default function CareerBarChart({
  data,
}: CareerBarChartProps) {
  const formattedData = data.map((item) => ({
    name: CAREER_LABELS[item._id] || item._id,
    value: item.totalNumberOfFellows,
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat().format(value)
            }
          />
          <Bar
            dataKey="value"
            fill="#8884d8"
            name="Fellows"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
