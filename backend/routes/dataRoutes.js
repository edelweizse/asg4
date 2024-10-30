import express from 'express';
import { getAllData, getFieldData } from '../controllers/dataController.js';
import { validateDates, validateFields } from '../middlewares/validators.js';


const router = express.Router();

router.get('/data/all', validateDates, getAllData);
router.get('/data/', validateDates, validateFields, getFieldData);

export default router;