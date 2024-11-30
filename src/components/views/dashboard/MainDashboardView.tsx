import { AreaChartComponent } from "@/components/ui/area-chart";
import { CircleCheck, CircleDollarSign, ClockArrowDown } from "lucide-react";
import React from "react";
import { ModalRecordIncome } from "./ModalRecordIncome";

const MainDashboardView = () => {
  return (
    <main>
      <section className="container">
        <div className="relative z-[1] min-h-[225px] w-full bg-gradient-to-tr    from-purple-700 py-4 rounded-br-xl rounded-bl-xl via-violet-500 to-violet-400">
          <h3 className="px-3 mt-10 text-right text-base font-medium text-white">
            LosBlancos
          </h3>
          <AreaChartComponent />
        </div>
        <div className=" px-3 h-[calc(100vh-200px)] w-full border rounded-xl -mt-20 dark:bg-gray-900">
          <div className="  grid grid-cols-1 sm:grid-cols-3 gap-2.5  mt-24 mb-4">
            <div className="h-11 dark:bg-black bg-white flex flex-col justify-between border px-4 py-1 border-gray-200 w-full rounded-3xl">
              <div className="flex items-center gap-1">
                <CircleCheck size={16} strokeWidth={1.5} color="#10B981" />
                <h3 className="text-xs font-medium  text-green-500">
                  Diterima
                </h3>
              </div>
              <h1 className="text-xs font-semibold text-gray-700 dark:text-white">
                Rp 1.000.000
              </h1>
            </div>
            <div className="h-11 dark:bg-black bg-white flex flex-col justify-between border px-4 py-1 border-gray-200 w-full rounded-3xl">
              <div className="flex items-center gap-1">
                <ClockArrowDown size={16} strokeWidth={1.5} color="red" />
                <h3 className="text-xs font-medium  text-red-500">
                  Belum Diterima
                </h3>
              </div>
              <h1 className="text-xs font-semibold text-gray-700 dark:text-white">
                Rp 1.000.000
              </h1>
            </div>
            <div className="h-11 dark:bg-black bg-white flex flex-col justify-between border px-4 py-1 border-gray-200 w-full rounded-3xl">
              <div className="flex items-center gap-1">
                <CircleDollarSign size={16} strokeWidth={1.5} color="blue" />
                <h3 className="text-xs font-medium  text-blue-500">Total</h3>
              </div>
              <h1 className="text-xs font-semibold text-gray-700 dark:text-white">
                Rp 1.000.000
              </h1>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="text-sm p-2 text-violet-700 rounded-xl border-b-2 border-gray-100 hover:border-violet-700 transition-all duration-300 ease-in-out">
              Terima
            </button>
            <ModalRecordIncome isLoading={false} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainDashboardView;
