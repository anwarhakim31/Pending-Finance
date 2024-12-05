import { ModalOneDelete } from "@/components/fragments/ModalOneDelete";
import { formatCurrency } from "@/utils/helpers";
import { Record } from "@/types/model";
import React from "react";
import { ModalEditRecord } from "./ModalEditRecord";

const RecordListView = ({ data }: { data: { data: { record: Record[] } } }) => {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 mt-6 gap-2">
      {data?.data?.record?.map((record: Record) => (
        <div
          key={record._id}
          className="relative rounded-md border border-gray-300 dark:border-gray-700 p-2 shadow-md pr-6"
        >
          <h5 className="text-sm font-medium line-clamp-1 text-black dark:text-white">
            {record.product}
          </h5>
          <p className="text-xs text-gray-600 mt-2 dark:text-white ">
            Jumlah Dijual : {record?.quantity} pcs
          </p>
          <p className="text-xs text-gray-600 mt-1 dark:text-white ">
            Total Harga : {formatCurrency((record?.total as number) || 0)}
          </p>
          <div className="absolute top-2 right-2 flex gap-2 bg-white dark:bg-black flex-col">
            <ModalOneDelete
              id={""}
              url={`/records/${record._id}`}
              keys={["groupData", "dashboard"]}
              pathname={`${data.data.record.length === 1 ? "/dashboard" : ""}`}
            />
            <ModalEditRecord data={record} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordListView;
