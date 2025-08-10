'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
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

interface ScoreBand {
  range: string;
  count: number;
}

interface CareerScores {
  selected_career: string;
  scoreBands: ScoreBand[];
}

interface ScoreBandsDonutProps {
  data: CareerScores[];
}

// Color gradient from red to green
const COLORS = {
  '0-9': '#ff4d4d', // Red
  '10-18': '#ffa64d', // Orange
  '19-27': '#70c170', // Light green
  '28-36': '#2eb82e', // Green
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
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
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  ) : null;
};

export default function ScoreBandsDonut({
  data,
}: ScoreBandsDonutProps) {
  const charts = data.map((careerData) => {
    const formattedData = careerData.scoreBands.map((band) => ({
      name: `Score: ${band.range}`,
      value: band.count,
      range: band.range,
    }));

    const total = formattedData.reduce(
      (sum, item) => sum + item.value,
      0
    );

    return (
      <div
        key={careerData.selected_career}
        className="bg-white rounded-lg p-4 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-4 text-center">
          {CAREER_LABELS[careerData.selected_career] ||
            careerData.selected_career}
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {formattedData.map((entry) => (
                  <Cell
                    key={entry.range}
                    fill={COLORS[entry.range as keyof typeof COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `${new Intl.NumberFormat().format(
                    value
                  )} fellows (${((value / total) * 100).toFixed(1)}%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {charts}
    </div>
  );
}
