export const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat("id-Id", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(value);
};
