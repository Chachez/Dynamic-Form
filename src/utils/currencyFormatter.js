export const currencyFormatter = (amount) => {
  return new Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "KES",
  }).format(amount);
};

export const amountFormatter = (amount) => {
  return new Intl.NumberFormat().format(amount);
};
