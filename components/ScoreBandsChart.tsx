'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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

interface ScoreBand {
  range: string;
  count: number;
}

interface CareerScores {
  selected_career: string;
  scoreBands: ScoreBand[];
}

interface ScoreBandsChartProps {
  data: CareerScores[];
}

const COLORS = {
  '0-9': '#FF8042',
  '10-18': '#FFBB28',
  '19-27': '#00C49F',
  '28-36': '#0088FE',
};

export default function ScoreBandsChart({
  data,
}: ScoreBandsChartProps) {
  const formattedData = data.map((item) => {
    const baseObj = {
      name:
        CAREER_LABELS[item.selected_career] || item.selected_career,
    };

    // Add each score band as a property
    item.scoreBands.forEach((band) => {
      baseObj[band.range] = band.count;
    });

    return baseObj;
  });

  return (
    <div className="w-full h-[500px]">
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
              `${new Intl.NumberFormat().format(value)} fellows`
            }
          />
          <Legend />
          <Bar
            dataKey="28-36"
            stackId="a"
            fill={COLORS['28-36']}
            name="Score: 28-36"
          />
          <Bar
            dataKey="19-27"
            stackId="a"
            fill={COLORS['19-27']}
            name="Score: 19-27"
          />
          <Bar
            dataKey="10-18"
            stackId="a"
            fill={COLORS['10-18']}
            name="Score: 10-18"
          />
          <Bar
            dataKey="0-9"
            stackId="a"
            fill={COLORS['0-9']}
            name="Score: 0-9"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
