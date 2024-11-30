"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#ffffff",
  },
  mobile: {
    label: "Mobile",
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function AreaChartComponent() {
  return (
    <ChartContainer className=" h-[175px] w-full p-0.5 " config={chartConfig}>
      <AreaChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} strokeDasharray="0.1 0.1" />
        <XAxis
          dataKey="month"
          interval={"preserveStartEnd"}
          axisLine={false}
          tickLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="mobile"
          type="natural"
          fill="transparent"
          fillOpacity={0.1}
          stroke="#ffffff"
          stackId="a"
        />
        <Area
          dataKey="desktop"
          type="natural"
          fill="transparent"
          fillOpacity={0.4}
          stroke="#ffffff"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}
