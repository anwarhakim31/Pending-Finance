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

  const startOfDay = new Date(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate(),
    0,
    0,
    0 // Waktu awal hari di UTC
  );
  const endOfDay = new Date(
    day.getUTCFullYear(),
    day.getUTCMonth(),
    day.getUTCDate(),
    16,
    59,
    59,
    999
  );

  return [startOfDay, endOfDay];
};

export const formatDateId = (date: string) => {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function convertBigIntToJSON(obj: { [key: string]: bigint }) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}
export const convertToJakartaTime = (date = new Date()) => {
  const dates = new Date(date).setDate(date.getDate() + 1);
  return new Date(dates);
};
