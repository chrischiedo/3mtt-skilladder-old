'use client';

import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export function TechnicalAssessmentPerformance({ scores = [] }) {
  const defaultChartData = [
    { week: 'Week1', percentage: 0, fill: 'var(--chart-1)' },
  ];

  const chartData = scores
    ? scores.map((item, index) => ({
        ...item,
        module: `Module ${index + 1}`,
      }))
    : defaultChartData.map((item) => ({
        ...item,
        fill: 'hsl(var(--chart-1))',
      }));

  const chartConfig = {
    week: {
      label: 'Module',
      color: 'hsl(var(--chart-5))',
    },
    // chrome: {
    //   label: 'Chrome',
    //   color: 'hsl(var(--chart-1))',
    // },
    // safari: {
    //   label: 'Safari',
    //   color: 'hsl(var(--chart-2))',
    // },
    // firefox: {
    //   label: 'Firefox',
    //   color: 'hsl(var(--chart-3))',
    // },
    // edge: {
    //   label: 'Edge',
    //   color: 'hsl(var(--chart-4))',
    // },
    // other: {
    //   label: 'Other',
    //   color: 'hsl(var(--chart-5))',
    // },
  } satisfies ChartConfig;

  return (
    <Card className="py-3 shadow-none border-none">
      {/* <CardHeader>
        <CardTitle>Line Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      {/* <pre>{JSON.stringify(scores, null, 2)}</pre> */}
      <CardContent className="px-0">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              left: 0,
              right: 32,
              bottom: 10,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              type="number"
              domain={[0, 100]}
              tickMargin={20}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  nameKey="percentage"
                />
              }
            />
            <Line
              dataKey="percentage"
              type="bump"
              activeDot={{
                r: 6,
              }}
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{
                r: 6,
                fill: 'hsl(var(--chart-2))',
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="module"
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
