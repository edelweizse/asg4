import { Dataset } from "../db/models/data.js";
import { buildDateQuery } from "../utils/buildDateQuery.js";
import { calculateMetrics } from "../utils/calculateMetrics.js";

export const getAllMetrics = async (req, res) => {
  const { start_date, end_date } = req.query;
  const query = buildDateQuery(start_date, end_date);
  
  try {
    const data = await Dataset.find(query);

    const stats = {
      open: calculateMetrics(data, "Open"),
      high: calculateMetrics(data, "High"),
      low: calculateMetrics(data, "Low"),
      close: calculateMetrics(data, "Close"),
      adj_close: calculateMetrics(data, "Adj_close"),
      volume: calculateMetrics(data, "Volume"),
    };
    res.status(200).json(stats);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error: ", error });
  }
};



export const getFieldMetrics = async (req, res) => {
  const { field, start_date, end_date } = req.query;
  const query = buildDateQuery(start_date, end_date);
  try {
    const data = await Dataset.find(query).select(`${field} -_id`);
    const stats = calculateMetrics(data, field);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}
