import { ModalOneDelete } from "@/components/fragments/ModalOneDelete";
import { Checkbox } from "@/components/ui/checkbox";
import { Record } from "@/types/model";
import { formatCurrency, formatDateId } from "@/utils/helpers";
import React from "react";

const HistoryCardList = ({
  item,
  handleCheck,
  checked,
}: {
  item: Record;
  handleCheck: (id: string) => void;
  checked: string[];
}) => {
  return (
    <div className="mt-4">
      <div
        className={`flex flex-between border border-l-4 ${
          item.type === "receive"
            ? "border-l-green-600 dark:border-l-blue-600"
            : "border-l-blue-600 dark:border-l-green-600"
        } p-4 gap-2 rounded-md min-h-[5.5rem] border-gray-300 dark:border-gray-600`}
      >
        <Checkbox
          id={item.id}
          onCheckedChange={() => handleCheck(item.id || "")}
          checked={checked?.includes(item.id || "")}
          className={`mt-0.5 ${
            item.type === "income"
              ? "data-[state=checked]:bg-blue-600"
              : "data-[state=checked]:bg-green-600"
          }`}
        />
        <div className="flex-1 ">
          <p className="text-xs">
            <span className="w-24 inline-block">Tanggal </span>:{" "}
            {item?.createdAt ? formatDateId(item?.createdAt.toString()) : "-"}
          </p>
          {item.product && item.quantity ? (
            <>
              <p className="text-xs">
                <span className="w-24 inline-block">Nama Barang </span>:{" "}
                {item?.product}
              </p>
              <p className="text-xs">
                <span className="w-24 inline-block">Jumlah</span>:{" "}
                {item?.quantity}
              </p>
            </>
          ) : null}
          <p className="text-xs">
            <span className="w-24 inline-block">Total</span>:{" "}
            {formatCurrency(Number(item.total) || 0)}
          </p>
        </div>
        <ModalOneDelete
          id={item.id || ""}
          url={`/records/history`}
          keys={["recordHistory", "records", "dateGroup"]}
        />
      </div>
    </div>
  );
};

export default HistoryCardList;
