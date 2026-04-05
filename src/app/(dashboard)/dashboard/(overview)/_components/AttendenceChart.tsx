"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { day: "Sun", present: 186, absent: 80 },
  { day: "Mon", present: 305, absent: 200 },
  { day: "Tue", present: 237, absent: 120 },
  { day: "Wed", present: 73, absent: 190 },
  { day: "Thu", present: 209, absent: 130 },
];

const chartConfig = {
  present: {
    label: "Present",
    color: "hsl(var(--chart-1))",
  },
  absent: {
    label: "Absent",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AttendenceChart() {
  return (
    <Card className="border-none shadow-md w-2/3">
      <CardHeader>
        <CardTitle>Attendence</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <div className="space-x-1 flex gap-2 items-center">
            <div className="size-4 bg-[hsl(var(--chart-1))] rounded-full" />{" "}
            Present
          </div>
          <div className="space-x-1 flex gap-2 items-center">
            <div className="size-4 bg-[hsl(var(--chart-2))] rounded-full" />{" "}
            Absent
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />

            <Bar dataKey="present" fill="var(--color-present)" radius={6} />
            <Bar dataKey="absent" fill="var(--color-absent)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
