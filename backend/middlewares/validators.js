const validFields = ["Open", "High", "Low", "Close", "Adj_close", "Volume", "Date"];
const minStartDate = "2008-03-19";
const maxStartDate = "2024-10-21";
const maxEndDate = "2024-10-21";

export const validateDates = (req, res, next) => {
  const { start_date, end_date } = req.query;
  if (start_date > end_date) return res.status(400).json({ message: "Start date cannot be greater than end date" });

  if (start_date > maxStartDate) return res.status(400).json({ message: `Start date cannot be greater than ${maxStartDate}` });
  if (start_date < minStartDate) return res.status(400).json({ message: `Start date cannot be less than ${minStartDate}` });

  if (end_date > maxEndDate) return res.status(400).json({ message: `End date cannot be greater than ${maxEndDate}` });
  if (end_date < minStartDate) return res.status(400).json({ message: `End date cannot be less than ${minStartDate}` });

  next()
}

export const validateFields = (req, res, next) => {
  const { field } = req.query;
  if(!field || !validFields.includes(field)) {
    return res.status(400).json({ message: "Invalid field name" });
  }
  next();
}
