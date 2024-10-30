import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './db/db.js';
import dataRoutes from './routes/dataRoutes.js';
import metricsRoutes from './routes/metricsRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(json());

app.use('/', dataRoutes)
app.use('/', metricsRoutes)


app.listen(process.env.PORT || 3000, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
})