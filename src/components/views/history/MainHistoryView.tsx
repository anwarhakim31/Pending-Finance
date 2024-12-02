"use client";

import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/ui/Loader";
import useFetchRecordHistory from "@/hooks/record/useFetchRecordHistory";
import { Record } from "@/types/model";
import { EllipsisVertical, FileQuestion } from "lucide-react";
import React from "react";
import HistoryCardList from "./HistoryCardList";
import { ModalDeleteHistory } from "./ModalDeleteHistory";

const MainHistoryView = () => {
  const [dataCheck, setDataCheck] = React.useState<string[]>([]);

  const { data, isLoading } = useFetchRecordHistory();

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

  return (
    <main>
      <section className="container pt-[4.5rem] pb-12 px-4 ">
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
        <div className="flex items-center gap-2 mt-3">
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
            <ModalDeleteHistory dataCheck={dataCheck} />
          </div>
        </div>
        {isLoading ? (
          <Loader />
        ) : data.data.length > 0 ? (
          <div>
            {data?.data?.map((item: Record) => (
              <HistoryCardList
                key={item.id}
                handleCheck={handleCheck}
                item={item}
                checked={dataCheck}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex justify-center items-center flex-col mt-20">
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
