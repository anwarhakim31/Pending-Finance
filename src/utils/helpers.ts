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

export const formatToday = (date: Date = new Date()) => {
  const startOfDayUTC = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
  const endOfDayUTC = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  return { startOfDayUTC, endOfDayUTC };
};

export const formatDateId = (date: string) => {
  const utcDate = new Date(date);
  return utcDate.toLocaleDateString("id-ID", {
    timeZone: "UTC",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const convertToJakartaTime = (date = new Date()) => {
  const dates = new Date(date).setDate(date.getDate() + 1);
  return new Date(dates);
};
