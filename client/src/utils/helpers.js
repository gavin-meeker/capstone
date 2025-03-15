const truncateString = (str, maxLength = 20) => {
  if (str.length > maxLength) {
    return str.slice(0, maxLength - 3) + "...";
  }
  return str;
};

export { truncateString };
