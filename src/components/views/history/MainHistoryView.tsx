"use client";

import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/ui/Loader";
import useFetchRecordHistory from "@/hooks/record/useFetchRecordHistory";
import { Record } from "@/types/model";
import { Copy, EllipsisVertical, FileQuestion } from "lucide-react";
import React from "react";
import HistoryCardList from "./HistoryCardList";
import { ModalDeleteHistory } from "./ModalDeleteHistory";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useSearchParams } from "next/navigation";
import { DatePickerWithRange } from "@/components/fragments/DatePickerRange";
import { DateRange } from "react-day-picker";
import Image from "next/image";
import wa from "@/assets/wa.svg";

import { toast } from "sonner";
import { historyMap, historyTextMap } from "@/utils/mapping";
import { useSession } from "next-auth/react";

const MainHistoryView = () => {
  const session = useSession();
  const [dataCheck, setDataCheck] = React.useState<string[]>([]);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "100");
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 10, 20),
    to: new Date(),
  });

  const { data, isLoading } = useFetchRecordHistory(
    page,
    pageSize,
    date?.from ?? new Date(2024, 10, 20),
    date?.to ?? new Date()
  );

  const handleCheckAll = () => {
    if (dataCheck.length > 0) {
      setDataCheck([]);
    } else {
      setDataCheck(data.data.map((item: Record) => item.id));
    }
  };

  const handleCheck = (id: string) => {
    if (dataCheck.includes(id)) {
      setDataCheck(dataCheck.filter((item: string) => item !== id));
    } else {
      setDataCheck((prev) => [...prev, id]);
    }
  };

  const handleCopyText = (data: Record[]) => {
    const remap = historyMap(data);

    navigator.clipboard.writeText(historyTextMap(remap)).then(() => {
      toast.success("Catatan berhasil disalin");
    });
  };

  const handleSendWa = (data: Record[]) => {
    if (!session.data?.user?.phone)
      toast.error("Nomor Whatsapp belum ditambakan di halaman profile");

    const remap = historyMap(data);

    const message = historyTextMap(remap);

    const url = `https://wa.me/${
      session.data?.user?.phone
    }?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  };

  return (
    <main>
      <section className="container pt-[4.5rem] pb-12 px-4 ">
        <div className="flex gap-2 items-center justify-between ">
          <div className="flex gap-2 items-center select-none">
            <div className="flex gap-1 items-center ">
              <EllipsisVertical size={16} className="text-blue-600" />
              <span className="text-xs">Ditambah</span>
            </div>
            <div className="flex gap-1 items-center ">
              <EllipsisVertical size={16} className="text-green-600" />
              <span className="text-xs">Diterima</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button
              aria-label="copy"
              title="Kirim Whatsapp"
              type="button"
              disabled={data?.data?.length === 0 || isLoading}
              onClick={() => handleSendWa(data?.data)}
              className="flex-center gap-2 w-8 h-8 rounded-md disabled:cursor-not-allowed bg-green-400 transition-all duration-300 ease-in border border-gray-300 hover:bg-green-500  dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:border-gray-500"
            >
              <Image src={wa} alt="whatsapp" width={20} height={20} />
            </button>
            <button
              aria-label="copy"
              title="Salin Catatan"
              type="button"
              disabled={data?.data?.length === 0 || isLoading}
              onClick={() => handleCopyText(data?.data)}
              className="flex-center gap-2 w-8 h-8 rounded-md  disabled:cursor-not-allowed bg-gray-200 transition-all duration-300 ease-in border border-gray-300 hover:bg-gray-100  dark:bg-gray-600 dark:border-gray-600 dark:hover:bg-gray-500 dark:hover:border-gray-500"
            >
              <Copy size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="check-all"
              disabled={isLoading || data?.data?.length === 0}
              checked={dataCheck.length === data?.data.length}
              onCheckedChange={handleCheckAll}
            />
            <label
              htmlFor="check-all"
              className={`text-xs ${
                data?.data?.length === 0 || isLoading
                  ? "text-muted-foreground"
                  : ""
              }`}
            >
              Pilih Semua
            </label>
            <ModalDeleteHistory
              dataCheck={dataCheck}
              setDataCheck={setDataCheck}
            />
          </div>

          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
        {isLoading ? (
          <Loader />
        ) : data?.data?.length > 0 ? (
          <div>
            {data?.data?.map((item: Record) => (
              <HistoryCardList
                key={item.id}
                handleCheck={handleCheck}
                item={item}
                checked={dataCheck}
              />
            ))}
            <div className="mt-8">
              {page === 1 && data.data.length < pageSize ? null : (
                <PaginationWithLinks
                  page={page}
                  pageSize={pageSize}
                  totalCount={data?.pagination?.total}
                  keys="recordHistory"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center items-center flex-col mt-48">
            <FileQuestion size={50} strokeWidth={1} />
            <p className="text-xs text-muted-foreground mt-2">
              Data Tidak Ditemukan.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default MainHistoryView;
