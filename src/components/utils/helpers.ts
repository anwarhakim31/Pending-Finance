export const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("id-Id", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
};

export const splitDate = (date: string) => {
  return new Date(date).toISOString().split("T")[0];
};

export const formatToday = (date: Date) => {
  const day = new Date(date);

  const startOfDay = new Date(day);
  startOfDay.setUTCHours(0, 0, 0, 0);

  const endOfDay = new Date(day);
  endOfDay.setUTCHours(23, 59, 59, 999);

  return [startOfDay, endOfDay];
};

export const formatDateId = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
