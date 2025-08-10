'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface EmploymentData {
  _id: string;
  count: number;
}

interface EmploymentPieChartProps {
  data: EmploymentData[];
}

const COLORS = {
  employed: '#4CAF50', // Green
  'self-employed': '#2196F3', // Blue
  student: '#9C27B0', // Purple
  unemployed: '#FF9800', // Orange
};

const STATUS_LABELS: { [key: string]: string } = {
  employed: 'Employed',
  'self-employed': 'Self-Employed',
  student: 'Student',
  unemployed: 'Unemployed',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
  name,
}: any) => {
  const radius = outerRadius * 1.1;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="#666"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize={12}
    >
      {`${STATUS_LABELS[name] || name} (${(percent * 100).toFixed(
        0
      )}%)`}
    </text>
  ) : null;
};

export default function EmploymentStatusPieChart({
  data,
}: EmploymentPieChartProps) {
  const formattedData = data.map((item) => ({
    name: item._id,
    value: item.count,
  }));

  const total = formattedData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name as keyof typeof COLORS]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              `${new Intl.NumberFormat().format(value)} fellows (${(
                (value / total) *
                100
              ).toFixed(1)}%)`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
