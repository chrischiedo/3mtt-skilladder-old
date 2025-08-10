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

const abbreviationKey = [
  { R: 'Realistic', fill: 'hsl(var(--chart-1))' },
  { I: 'Investigative', fill: 'hsl(var(--chart-2))' },
  { A: 'Artistic', fill: 'hsl(var(--chart-3))' },
  { S: 'Social', fill: 'hsl(var(--chart-4))' },
  { E: 'Enterprising', fill: 'hsl(var(--chart-5))' },
  { C: 'Conventional', fill: 'hsl(var(--chart-1))' },
];

export function RIASECChart({
  data,
}: {
  data: Record<string, number>;
}) {
  const chartDataDefault = [
    { career: 'Realistic', rating: 0 },
    { career: 'Investigative', rating: 0 },
    { career: 'Artistic', rating: 0 },
    { career: 'Social', rating: 0 },
    { career: 'Enterprising', rating: 0 },
    { career: 'Conventional', rating: 0 },
  ];

  const riasecData = Object.entries(data).map(
    ([abbreviation, rating]) => {
      const career =
        abbreviationKey.find(
          (item) =>
            item[abbreviation as keyof (typeof abbreviationKey)[0]]
        )?.[abbreviation as keyof (typeof abbreviationKey)[0]] ||
        abbreviation;
      const fill =
        abbreviationKey.find(
          (item) =>
            item[abbreviation as keyof (typeof abbreviationKey)[0]]
        )?.fill || 'hsl(var(--chart-1))'; // Default fill if not found
      return {
        career,
        rating: parseFloat(rating.toFixed(1)),
        fill,
      };
    }
  );

  const chartData = data ? riasecData : chartDataDefault;

  // const chartConfig = {
  //   career: {
  //     label: 'Career path',
  //     color: 'hsl(var(--chart-3))',
  //   },
  // };

  const chartConfig = {
    career: {
      label: 'Career',
    },
    realistic: {
      label: 'Realistic',
      color: 'hsl(var(--chart-1))',
    },
    investigative: {
      label: 'Investigative',
      color: 'hsl(var(--chart-2))',
    },
    artistic: {
      label: 'Artistic',
      color: 'hsl(var(--chart-3))',
    },
    social: {
      label: 'Social',
      color: 'hsl(var(--chart-3))',
    },
    enterprising: {
      label: 'Enterprising',
      color: 'hsl(var(--chart-4))',
    },
    conventional: {
      label: 'Conventional',
      color: 'hsl(var(--chart-5))',
    },
  } satisfies ChartConfig;

  return (
    <Card className="py-3 shadow-none border-none">
      <CardContent className="px-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 40,
            }}
          >
            <YAxis
              dataKey="career"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={13} // Increased font size
              fontWeight="bold" // Made font bolder
            />
            <XAxis dataKey="rating" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="rating"
              layout="vertical"
              radius={5}
              fill="hsl(var(--chart-1))"
              barSize={30} // Increased bar size
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
