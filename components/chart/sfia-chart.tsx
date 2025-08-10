'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

import { TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SFIAChart({ data }) {
  const chartDataDefault = [
    { career: 'Cloud Computing', rating: 0 },
    { career: 'DevOps', rating: 0 },
    { career: 'AI/Machine Learning', rating: 0 },
    { career: 'Cybersecurity', rating: 0 },
    { career: 'Software Development', rating: 0 },
    { career: 'Quality Assurance', rating: 0 },
    { career: 'Data Science', rating: 0 },
    { career: 'Product Management', rating: 0 },
    { career: 'Game Development', rating: 0 },
    { career: 'Data Analysis & Visualization', rating: 0 },
    { career: 'UI/UX Design', rating: 0 },
    { career: 'Animation', rating: 0 },
  ];

  const sfiaData = data.sortedCareerKeys.map(
    (career: string, index: number) => ({
      career,
      rating: parseFloat(
        data.sortedCareerConfidences[index].toFixed(1)
      ),
    })
  );

  const chartData = data ? sfiaData : chartDataDefault;

  const chartConfig = {
    career: {
      label: 'Career path',
      color: 'hsl(var(--chart-3))',
    },
  };

  return (
    <Card className="py-3 shadow-none border-none">
      <CardContent className="px-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="career"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="rating" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="rating"
              layout="vertical"
              fill="var(--color-career)"
              radius={4}
            >
              <LabelList
                dataKey="career"
                position="insideBottomLeft"
                offset={8}
                className="fill-white"
                fontSize={12}
              />
              <LabelList
                dataKey="rating"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `${value}%`} // Display with percentage
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
