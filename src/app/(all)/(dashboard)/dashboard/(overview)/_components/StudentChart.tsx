"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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
  { type: "boys", students: 275, fill: "var(--color-boys)" },
  { type: "girls", students: 200, fill: "var(--color-girls)" },
];

const chartConfig = {
  students: {
    label: "Students",
  },
  boys: {
    label: "Boys",
    color: "hsl(var(--chart-1))",
  },
  girls: {
    label: "Girls",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function StudnetChart() {
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0);
  }, []);

  return (
    <Card className="flex flex-col w-1/3 border-none shadow-md">
      <CardHeader className="">
        <CardTitle>Students</CardTitle>
        <CardDescription className="flex items-center w-full gap-4">
          <div className="flex items-center gap-2">
            <div className="size-4 bg-[hsl(var(--chart-1))] rounded-full" />
            <div className="flex flex-col">
              {/* <span className="text-lg text-primary-foreground">2503</span> */}
              <span>Boys</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 bg-[hsl(var(--chart-2))] rounded-full" />
            <div className="flex flex-col">
              {/* <span className="text-lg text-primary-foreground">2503</span> */}
              <span>Girls</span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              data={chartData}
              dataKey="students"
              nameKey="type"
              innerRadius={50}
              strokeWidth={20}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Students
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
