import { Record } from "@/types/model";
import { formatDateId, formatCurrency } from "./helpers";

export const recordTexMap = (data: {
  data: { totalIncome: number; date: string; record: Record[] };
}) => {
  return `Catatan ${formatDateId(
    data?.data?.date || ""
  )}\n${data?.data?.record.map((item: Record, i: number) => {
    return `\n${i + 1} .${item.product} : ${
      item.quantity
    } pcs = ${formatCurrency(item.total || 0)}`;
  })}\n\n${
    data.data.totalIncome
      ? `Total : ${formatCurrency(
          data.data.record.reduce(
            (acc, item) => acc + Number(item.total || 0),
            0
          )
        )}`
      : 0
  }`;
};

export const historyMap = (data: Record[]) => {
  return data.reduce(
    (acc: { date: string; type: string; data: Record[] }[], item: Record) => {
      const last = acc[acc.length - 1];

      if (item.type === "income") {
        if (acc.length > 0 && last.type === "income") {
          if (
            new Date(last.date || "").toDateString() ===
            new Date(item.createdAt || "").toDateString()
          ) {
            last.data.push(item);
          } else {
            acc.push({
              date: new Date(item.createdAt || "").toDateString(),
              type: "income",
              data: [item],
            });
          }
        } else {
          acc.push({
            date: new Date(item.createdAt || "").toDateString(),
            type: "income",
            data: [item],
          });
        }
      } else {
        if (acc.length > 0 && last.type === "receive") {
          if (
            new Date(last.date || "").toDateString() ===
            new Date(item.createdAt || "").toDateString()
          ) {
            last.data.push(item);
          } else {
            acc.push({
              date: new Date(item.createdAt || "").toDateString(),
              type: "receive",
              data: [item],
            });
          }
        } else {
          acc.push({
            date: new Date(item.createdAt || "").toDateString(),
            type: "receive",
            data: [item],
          });
        }
      }
      return acc;
    },
    []
  );
};

export const historyTextMap = (
  remap: { date: string; type: string; data: Record[] }[]
) => {
  return `Catatan${remap.map(
    (item: { date: string; type: string; data: Record[] }) => {
      return `${`\n${
        item.type === "income" ? "\n*Penjualan*" : "\n*Diterima*"
      } ${formatDateId(item.date?.toString() || "")}`} ${
        item.type === "income"
          ? `${item.data.map((item: Record, i: number) => {
              return `\n${i + 1}. ${item.product} : ${
                item.quantity
              } pcs = ${formatCurrency(item.total || 0)}`;
            })}\n${
              item.type === "income"
                ? `Total : ${formatCurrency(
                    item.data.reduce(
                      (acc, item) => acc + (Number(item.total) || 0),
                      0
                    )
                  )}\n`
                : ``
            }`
          : `${
              item.type === "receive"
                ? `\nTotal : ${formatCurrency(
                    Number(item.data[0]?.total || 0)
                  )}`
                : `\n`
            }`
      }`;
    }
  )}\n===================\nTotal Sudah Diterima : ${formatCurrency(
    remap
      .filter((item) => item.type === "receive")
      .reduce((acc, item) => acc + Number(item.data[0]?.total || 0), 0)
  )}\nTotal Pendapatan : ${formatCurrency(
    remap
      .filter((item) => item.type === "income")
      .reduce((acc, item) => acc + Number(item.data[0]?.total || 0), 0)
  )}\nTotal Belum Diterima: ${formatCurrency(
    remap
      .filter((item) => item.type === "receive")
      .reduce((acc, item) => acc + Number(item.data[0]?.total || 0), 0) -
      remap
        .filter((item) => item.type === "receive")
        .reduce((acc, item) => acc + Number(item.data[0]?.total || 0), 0)
  )}\n
  `;
};
