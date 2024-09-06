const displayCurrency = (num) => {
  const formatter = new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "vnd",
    minimumFractionDigits: 0,
  });

  return formatter.format(num);
};

export default displayCurrency;
