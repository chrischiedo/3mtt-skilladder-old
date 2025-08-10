'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface EducationData {
  _id: string;
  count: number;
}

interface EducationPieChartProps {
  data: EducationData[];
}

const COLORS = {
  bachelors: '#4299E1', // Blue
  masters: '#48BB78', // Green
  phd: '#805AD5', // Purple
  diploma: '#F6AD55', // Orange
  others: '#FC8181', // Red
  secondary_school_certificate: '#4FD1C5', // Teal
};

const EDUCATION_LABELS: { [key: string]: string } = {
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  phd: 'PhD',
  diploma: 'Diploma',
  others: 'Others',
  secondary_school_certificate: 'Secondary School',
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
      {`${EDUCATION_LABELS[name] || name} (${(percent * 100).toFixed(
        0
      )}%)`}
    </text>
  ) : null;
};

export default function EducationLevelPieChart({
  data,
}: EducationPieChartProps) {
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
