"use client";
import { BarChartComponent } from "@/components/ui/bar-chart";
import {
  CalendarPlus,
  CircleCheck,
  CircleDollarSign,
  ClockArrowDown,
} from "lucide-react";
import React from "react";
import { ModalRecordIncome } from "./ModalRecordIncome";
import { ModalRecordReceive } from "./ModalRecordReceive";
// import useFetchStatistic from "@/hooks/record/useFetchStatistic";
import DateRecordView from "./DateRecordView";
import { Meteors } from "@/components/ui/meteor";
import AnimateCounter from "@/components/ui/animate-counter";
import useFetchDashboard from "@/hooks/record/useFetchDashboard";

const MainDashboardView = () => {
  // const { data, isLoading } = useFetchStatistic();
  const [month, setMonth] = React.useState(new Date());

  const { data, isLoading } = useFetchDashboard(month);

  return (
    <main>
      <section className="container">
        <div className="overflow-hidden relative z-[1] min-h-[250px] w-full bg-gradient-to-tr    from-purple-700 py-4 rounded-br-2xl rounded-bl-2xl via-violet-500 to-violet-400">
          <h3 className="px-3 mt-10 text-center text-base font-medium text-white">
            LosBlancos
          </h3>
          <BarChartComponent
            data={data?.resStatistic?.data.chartStatistic}
            isLoading={isLoading}
          />
          <Meteors number={10} />
        </div>
        <div className=" px-3 min-h-[calc(100vh-140px)]  w-full   -mt-20 pb-20 md:pb-0 ">
          <div className="  grid grid-cols-1 sm:grid-cols-3 gap-2.5  mt-24 mb-4">
            <div className="h-14 dark:bg-black dark:border-gray-400 bg-white flex flex-col justify-between border px-4 py-2 border-gray-200 w-full rounded-xl">
              <div className="flex items-center gap-1">
                <CircleCheck size={16} strokeWidth={1.5} color="#10B981" />
                <h3 className="text-xs font-medium  text-green-500">
                  Diterima
                </h3>
              </div>
              <h1 className="text-sm font-normal text-gray-700 dark:text-white">
                <AnimateCounter
                  value={data?.resStatistic?.data.totalReceive || 0}
                  type="currency"
                />
              </h1>
            </div>
            <div className="h-14 dark:bg-black dark:border-gray-400 bg-white flex flex-col justify-between border px-4 py-2 border-gray-200 w-full rounded-xl">
              <div className="flex items-center gap-1">
                <ClockArrowDown size={16} strokeWidth={1.5} color="red" />
                <h3 className="text-xs font-medium  text-red-500">
                  Belum Diterima
                </h3>
              </div>
              <h1 className="text-sm font-normal text-gray-700 dark:text-white">
                <AnimateCounter
                  value={data?.resStatistic?.data.totalPending || 0}
                  type="currency"
                />
              </h1>
            </div>
            <div className="h-14 dark:bg-black dark:border-gray-400 bg-white flex flex-col justify-between border px-4 py-2 border-gray-200 w-full rounded-xl">
              <div className="flex items-center gap-1">
                <CircleDollarSign size={16} strokeWidth={1.5} color="blue" />
                <h3 className="text-xs font-medium  text-blue-500">Total</h3>
              </div>
              <h1 className="text-sm font-normal text-gray-700 dark:text-white">
                <AnimateCounter
                  value={data?.resStatistic?.data.totalIncome || 0}
                  type="currency"
                />
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ModalRecordReceive isLoading={isLoading} />
            <ModalRecordIncome isLoading={isLoading} />
          </div>
          <div className="flex items-center mt-6 mb-4 text-gray-500 gap-2">
            <CalendarPlus size={20} strokeWidth={1.5} />
            <h3 className="text-xs text-normal  ">Riwayat terakhir ditambah</h3>
          </div>
          <DateRecordView data={data?.resGroup} setMonth={setMonth} />
        </div>
      </section>
    </main>
  );
};

export default MainDashboardView;
