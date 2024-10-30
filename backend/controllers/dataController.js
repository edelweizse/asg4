import { Dataset } from "../db/models/data.js";
import { buildDateQuery } from "../utils/buildDateQuery.js";

export const getAllData = async (req, res) => {
  const { start_date, end_date } = req.query;
  const query = buildDateQuery(start_date, end_date);
  try {
    const data = await Dataset.find(query).select("-_id");
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
}

export const getFieldData = async (req, res) => {
  const { field, start_date, end_date } = req.query;
  const query = buildDateQuery(start_date, end_date);
  try {
    const data = await Dataset.find(query).select(`Date ${field} -_id`); 
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Internal server error: ", error });
  }
}