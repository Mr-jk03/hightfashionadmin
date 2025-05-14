export const formatter = (input: number, currencyFee?: string) => {
  if (!isNaN(input)) {
    if (currencyFee) {
      if (currencyFee == "VND") {
        return Math.round(input)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      } else {
        return input
          .toFixed(2)
          .toString()
          .replace(/\d(?=(\d{3})+\.)/g, "$&,");
      }
    } else return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else return "0";
};
