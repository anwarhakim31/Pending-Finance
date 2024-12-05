"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "./skeleton";
import { BarChart2Icon } from "lucide-react";

const chartConfig = {
  diterima: {
    label: "Diterima",
    color: "#ffffff",
  },
  ditambah: {
    label: "Ditambah",
    color: "#ffffff",
  },
} satisfies ChartConfig;

export function BarChartComponent({
  data,
  isLoading,
}: {
  data: { date: string; ditambah: number; diterima: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center py-6 px-4 justify-between h-[165px] w-[100%] mx-auto">
        <div className="flex items-end justify-center  h-full w-full gap-2">
          <Skeleton className=" h-[80%] w-4 bg-gray-200 rounded-sm"></Skeleton>
          <Skeleton className=" h-[50%] w-4 bg-gray-200 rounded-sm"></Skeleton>
        </div>
        <div className="flex items-end justify-center  h-full w-full gap-2">
          <Skeleton className=" h-[75%] w-4 bg-gray-200 rounded-sm"></Skeleton>
          <Skeleton className=" h-[80%] w-4 bg-gray-200 rounded-sm"></Skeleton>
        </div>
        <div className="flex items-end justify-center  h-full w-full gap-2">
          <Skeleton className=" h-[60%] w-4 bg-gray-200 rounded-sm"></Skeleton>
          <Skeleton className=" h-[70%] w-4 bg-gray-200 rounded-sm"></Skeleton>
        </div>
        <div className="flex items-end justify-center  h-full w-full gap-2">
          <Skeleton className=" h-[65%] w-4 bg-gray-200 rounded-sm"></Skeleton>
          <Skeleton className=" h-[75%] w-4 bg-gray-200 rounded-sm"></Skeleton>
        </div>
        <div className="flex items-end justify-center  h-full w-full gap-2">
          <Skeleton className=" h-[60%] w-4 bg-gray-200 rounded-sm"></Skeleton>
          <Skeleton className=" h-[90%] w-4 bg-gray-200 rounded-sm"></Skeleton>
        </div>
      </div>
    );
  }

  if (!isLoading && data?.length === 0) {
    return (
      <div className="flex items-center py-6 px-4 justify-center h-[165px] w-[100%] mx-auto">
        <div className="flex items-center justify-center gap-2">
          <BarChart2Icon color="#ffffff" />
          <p className="text-white text-xs ">Tidak ada catatan.</p>
        </div>
      </div>
    );
  }

  return (
    <ChartContainer className=" h-[165px] w-full p-0.5 " config={chartConfig}>
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} strokeDasharray="0.1 0.1" />
        <XAxis
          dataKey="date"
          interval={"preserveStartEnd"}
          axisLine={false}
          tickLine={false}
          label={{
            value: "Pendapatan",
            position: "insideBottom",
            fill: "#ffffff",
            fontSize: 12,
            textAnchor: "middle",
            dy: 8,
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dashed" />}
        />
        <Bar dataKey="ditambah" fill="#09a2ff" barSize={20} radius={4} />
        <Bar dataKey="diterima" fill="#ef4d4d" barSize={20} radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
