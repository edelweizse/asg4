import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import dayjs from 'dayjs';

const Predicts = () => {
  const [predictData, setPredictData] = useState([]);
  const [closeData, setCloseData] = useState([]);
  const [startDate, setStartDate] = useState('2022-10-21');
  const [endDate, setEndDate] = useState('2024-10-21');
  const minDate = dayjs('2008-03-19');
  const maxDate = dayjs('2024-10-21');

  const getPredictData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/predict');
      setPredictData(res.data);
    } catch (error) {
      console.error('Error fetching predicted data:', error);
    }
  };

  const getCloseData = async (start_date, end_date) => {
    try {
      const res = await axios.get(`http://localhost:5000/data?field=Close&start_date=${start_date}&end_date=${end_date}`);
      const formattedData = res.data.map(item => ({
        ...item,
        Date: dayjs(item.Date).format('YYYY-MM-DD'),
      }));
      setCloseData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const combineData = () => {
    const filteredCloseData = closeData.filter(item => dayjs(item.Date).isBefore(maxDate));
    const combined = filteredCloseData.map(item => ({
      Date: item.Date,
      Close: item.Close,
      isPredicted: false,
    }));

    const predicted = predictData
      .filter(item => dayjs(item.Date).isAfter(maxDate))
      .map(item => ({
        Date: item.Date,
        Close: item.Close,
        isPredicted: true,
      }));

    return [...combined, ...predicted].sort((a, b) => new Date(a.Date) - new Date(b.Date));
  };

  const validateDates = (start, end) => {
    if (dayjs(end).isBefore(dayjs(start))) {
      alert("End date must be greater than start date.");
      return false;
    }
    if (dayjs(start).isBefore(minDate) || dayjs(start).isAfter(maxDate)) {
      alert(`Start date must be between ${minDate.format('YYYY-MM-DD')} and ${maxDate.format('YYYY-MM-DD')}.`);
      return false;
    }
    if (dayjs(end).isBefore(minDate) || dayjs(end).isAfter(maxDate)) {
      alert(`End date must be between ${minDate.format('YYYY-MM-DD')} and ${maxDate.format('YYYY-MM-DD')}.`);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (validateDates(startDate, endDate)) {
      getCloseData(startDate, endDate);
    }
    getPredictData();
  }, [startDate, endDate]);

  const combinedData = combineData();

  return (
    <>
      <Navbar />
      <div className="w-screen h-screen grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 bg-gray-900 text-gray-300">
        <div className="col-span-3 row-span-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Date" tickFormatter={date => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={label => new Date(label).toLocaleDateString()} />
              <Line 
                type="monotone" 
                dataKey="Close" 
                stroke="#8884d8" 
                dot={false} 
                name="Historical Close" 
              />
              <Line 
                type="monotone" 
                dataKey="Close" 
                stroke="#ff7300" 
                dot={false} 
                isAnimationActive={false} 
                connectNulls={true} 
                data={combinedData.filter(item => item.isPredicted)} 
                name="Predicted Close" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Predicts;
