import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  Date: { type: Date, required: true },
  Open: { type: Number, required: true },
  High: { type: Number, required: true },
  Low: { type: Number, required: true },
  Close: { type: Number, required: true },
  Adj_close: { type: Number, required: true },
  Volume: { type: Number, required: true },
}, { collection: "data" });

export const Dataset = mongoose.model('data', dataSchema)