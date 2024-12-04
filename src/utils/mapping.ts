import { Record } from "@/types/model";
import { formatDateId, formatCurrency } from "./helpers";

export const recordTexMap = (data: {
  data: { totalIncome: number; date: string; record: Record[] };
}) => {
  return `Catatan ${formatDateId(
    data?.data?.date || ""
  )}\n${data?.data?.record.map((item: Record, i: number) => {
    return `\n${i + 1}. ${item.product} : ${
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
  const groupedData = new Map<
    string,
    { date: string; type: string; data: Record[] }
  >();

  data.forEach((item) => {
    const key = `${item.type}-${new Date(item.date || "").toDateString()}`;
    const existingEntry = groupedData.get(key);

    if (existingEntry) {
      // Jika key sudah ada, tambahkan item ke dalam data
      existingEntry.data.push(item);
    } else {
      // Jika belum ada, tambahkan entri baru
      groupedData.set(key, {
        date: new Date(item.date || "").toDateString(),
        type: item.type || "",
        data: [item],
      });
    }
  });

  return Array.from(groupedData.values()).sort((a, b) =>
    a.date.localeCompare(b.date)
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
                  )}`
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
      .filter((item) => (item.type === "receive" ? item : null))
      .reduce(
        (total, item) =>
          total +
          item.data.reduce((acc, item) => acc + Number(item.total || 0), 0),
        0
      )
  )}\nTotal Pendapatan : ${formatCurrency(
    remap
      .filter((item) => (item.type === "income" ? item : null))
      .reduce(
        (total, item) =>
          total +
          item.data.reduce((acc, item) => acc + Number(item.total || 0), 0),
        0
      )
  )}\nTotal Belum Diterima: ${formatCurrency(
    remap
      .filter((item) => (item.type === "income" ? item : null))
      .reduce(
        (total, item) =>
          total +
          item.data.reduce((acc, item) => acc + Number(item.total || 0), 0),
        0
      ) -
      remap
        .filter((item) => (item.type === "receive" ? item : null))
        .reduce(
          (total, item) =>
            total +
            item.data.reduce((acc, item) => acc + Number(item.total || 0), 0),
          0
        )
  )}\n
  `;
};
