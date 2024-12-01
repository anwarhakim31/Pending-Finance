"use client";
import { ModalOneDelete } from "@/components/fragments/ModalOneDelete";
import BubbleComponent from "@/components/ui/bubble";
import { formatCurrency, formatDateId } from "@/components/utils/helpers";
import useFetchGroupData from "@/hooks/record/useFetchGroupData";
import { Boxes, CircleDollarSign } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { ModalEditRecord } from "./ModalEditRecord";
import { Record } from "@/types/model";

const MainRecordView = ({ id }: { id: string }) => {
  const { data, isError } = useFetchGroupData(id);

  useEffect(() => {
    if (isError) {
      toast.error("Data tidak ditemukan");
    }
  }, [isError]);

  return (
    <main>
      <section className="container pt-[4.5rem] pb-12 px-4 sm:pb-0">
        <h3 className="text-sm font-medium text-black dark:text-white">
          Tanggal Dicatat :
        </h3>
        <p className="text-[10px] xs:text-xs text-gray-600 mt-1 dark:text-white ">
          {formatDateId(data?.data?.date || "")}
        </p>
        <div className="relative grid mt-4 grid-cols-2 gap-2 overflow-hidden w-full min-h-20 bg-gradient-to-tr rounded-lg from-purple-700 p-4  via-violet-500 to-violet-400">
          <div className=" p-2 flex items-center gap-2">
            <div className="flex-shrink-0 h-7 w-7 flex-center bg-white rounded-full ">
              <CircleDollarSign
                size={18}
                strokeWidth={1.5}
                className="text-blue-500"
              />
            </div>
            <div>
              <h5 className="text-[10px] xs:text-xs sm:text-sm text-white">
                Total Pendapatan
              </h5>
              <p className="text-sm sm:text-lg font-medium text-white">
                {formatCurrency(data?.data?.totalIncome || 0)}
              </p>
            </div>
          </div>
          <div className="relative z-10 p-2 flex items-center gap-2 ">
            <div className="flex-shrink-0 h-7 w-7 flex-center bg-white rounded-full ">
              <Boxes
                size={18}
                strokeWidth={1.5}
                className="text-white fill-orange-300"
              />
            </div>
            <div>
              <h5 className="text-[10px] xs:text-xs sm:text-sm text-white">
                Total Barang Dijual
              </h5>
              <p className="text-sm sm:text-lg font-medium text-white">
                {data?.data?.totalProduct || 0}
              </p>
            </div>
          </div>
          <BubbleComponent />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 mt-6 gap-2">
          {data?.data?.record?.map((record: Record) => (
            <div
              key={record.id}
              className="relative rounded-md border border-gray-300 dark:border-gray-700 p-2 shadow-md pr-6"
            >
              <h5 className="text-sm font-medium line-clamp-1 text-black dark:text-white">
                {record.product}
              </h5>
              <p className="text-[10px] xs:text-xs text-gray-600 mt-2 dark:text-white ">
                Jumlah Dijual : {record?.quantity}
              </p>
              <p className="text-[10px] xs:text-xs text-gray-600 mt-1 dark:text-white ">
                Total Harga : {formatCurrency((record?.total as number) || 0)}
              </p>
              <div className="absolute top-2 right-2 flex gap-2 bg-white dark:bg-black flex-col">
                <ModalOneDelete id={data?.data?.id || ""} url="" keys="" />
                <ModalEditRecord data={data?.data} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default MainRecordView;
