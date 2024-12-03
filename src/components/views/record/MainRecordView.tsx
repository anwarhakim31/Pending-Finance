"use client";
import { formatDateId } from "@/utils/helpers";
import useFetchGroupData from "@/hooks/record/useFetchGroupData";
import { Boxes, CircleDollarSign, Copy } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/ui/Loader";
import { Skeleton } from "@/components/ui/skeleton";
import AnimateCounter from "@/components/ui/animate-counter";
import { ModalDeleteRecord } from "./ModalDeleteRecord";
import RecordListView from "./RecordListView";
import { Record } from "@/types/model";
import Image from "next/image";
import wa from "@/assets/wa.svg";
import { recordTexMap } from "@/utils/mapping";

const MainRecordView = ({ id }: { id: string }) => {
  const { data, isError, isLoading, isFetching } = useFetchGroupData(id);
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      toast.error("Data tidak ditemukan");
    }
  }, [isError]);

  useEffect(() => {
    if (!isLoading && !isFetching && data?.data?.record?.length === 0) {
      router.push("/dashboard");
    }
  }, [isLoading, data?.data?.record?.length, router, isFetching]);

  const handleSendWhatsapp = (data: {
    data: { totalIncome: number; date: string; record: Record[] };
  }) => {
    const message = recordTexMap(data);

    const url = `https://wa.me/6281319981546?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  const handleCopyText = (data: {
    data: { totalIncome: number; date: string; record: Record[] };
  }) => {
    navigator.clipboard.writeText(recordTexMap(data)).then(() => {
      toast.success("Catatan berhasil disalin");
    });
  };

  return (
    <main>
      <section className="container pt-[4.5rem] pb-12 px-4 sm:pb-0">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium text-black dark:text-white">
              Tanggal Dicatat :
            </h3>
            {isLoading ? (
              <Skeleton className=" h-4 w-32 mt-1 bg-gray-200 rounded-xs"></Skeleton>
            ) : (
              <p className="text-xs text-gray-600 mt-1 dark:text-white ">
                {formatDateId(data?.data?.date || "")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="copy"
              title="Salin Catatan"
              type="button"
              onClick={() => handleSendWhatsapp(data)}
              className="flex-center gap-2 w-8 h-8 rounded-md bg-green-400 transition-all duration-300 ease-in border border-gray-300 hover:bg-green-500  dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:border-gray-500"
            >
              <Image src={wa} alt="whatsapp" width={20} height={20} />
            </button>
            <button
              aria-label="copy"
              title="Kirim Whatsapp"
              type="button"
              onClick={() => handleCopyText(data)}
              className="flex-center gap-2 w-8 h-8 rounded-md bg-gray-200 transition-all duration-300 ease-in border border-gray-300 hover:bg-gray-100  dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:border-gray-500"
            >
              <Copy size={16} strokeWidth={1.5} />
            </button>
            <ModalDeleteRecord id={id} />
          </div>
        </div>
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
                <AnimateCounter
                  value={parseInt(data?.data?.totalIncome || "0")}
                  type="currency"
                />
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
                <AnimateCounter
                  value={data?.data?.totalProduct || 0}
                  type="number"
                />
              </p>
            </div>
          </div>
        </div>

        {isLoading ? <Loader /> : <RecordListView data={data} id={id} />}
      </section>
    </main>
  );
};

export default MainRecordView;
