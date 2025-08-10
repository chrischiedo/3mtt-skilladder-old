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

interface CohortData {
  cohort: string;
  count: number;
}

interface CareerCohortData {
  _id: string;
  career: string;
  cohorts: CohortData[];
}

interface CareerCohortBarChartProps {
  data: CareerCohortData[];
}

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

const COLORS = {
  cohort_2: '#2196F3', // Blue
  cohort_3: '#4CAF50', // Green
};

export default function CareerCohortBarChart({
  data,
}: CareerCohortBarChartProps) {
  const formattedData = data.map((item) => {
    const baseObj = {
      name: CAREER_LABELS[item._id] || item._id,
    };

    // Add each cohort's count as a property
    item.cohorts.forEach((cohort) => {
      baseObj[cohort.cohort] = cohort.count;
    });

    return baseObj;
  });

  return (
    <div className="h-[500px] w-full">
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
            height={80}
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
            dataKey="cohort_2"
            name="Cohort 2"
            fill={COLORS.cohort_2}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="cohort_3"
            name="Cohort 3"
            fill={COLORS.cohort_3}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
