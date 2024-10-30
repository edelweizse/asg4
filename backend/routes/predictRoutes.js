import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/predict', async (req, res) => {
  try {
    const data = await axios.get('http://localhost:5001/predict')
    return res.status(200).json(data.data)
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server Error' });
  }
})

export default router;