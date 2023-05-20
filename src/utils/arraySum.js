export const sumArray = (arr) => {
  if (!Array.isArray(arr)) return;
  return arr.reduce(
    (previousValue, currentValue) => previousValue + currentValue,
    0
  );
};
