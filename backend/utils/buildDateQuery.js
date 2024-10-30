export const buildDateQuery = (start_date, end_date) => {
  const dateRangeQuery = {};
  const minStartDate = new Date("2008-03-19");
  const maxEndDate = new Date("2024-10-21");

  if (start_date && end_date) {
    dateRangeQuery.Date = { $gte: new Date(start_date), $lte: new Date(end_date) };
  } else if (start_date) {
    dateRangeQuery.Date = { $gte: new Date(start_date), $lte: maxEndDate };
  } else if (end_date) {
    dateRangeQuery.Date = { $gte: minStartDate, $lte: new Date(end_date) };
  } else {
    dateRangeQuery.Date = { $gte: minStartDate, $lte: maxEndDate };
  }
  return dateRangeQuery;
};