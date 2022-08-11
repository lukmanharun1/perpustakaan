module.exports = (date1, date2) => {
  const diffTime = new Date(date1).getTime() - new Date(date2).getTime();
  return diffTime / (1000 * 3600 * 24);
};
