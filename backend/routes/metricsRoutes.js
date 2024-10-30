import express from 'express';
import { getFieldMetrics, getAllMetrics } from '../controllers/metricsController.js';
import { validateDates, validateFields } from '../middlewares/validators.js';

const router = express.Router();

router.get('/metrics/all', validateDates, getAllMetrics);
router.get('/metrics', validateDates, validateFields, getFieldMetrics);

export default router;