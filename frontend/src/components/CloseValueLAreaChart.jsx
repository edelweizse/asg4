import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';
import dayjs from 'dayjs';

const CloseValueLAreaChart = () => {
  const [closeData, setCloseData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [startDate, setStartDate] = useState('2008-03-19');
  const [endDate, setEndDate] = useState('2024-10-21');
  const minDate = dayjs('2008-03-19');
  const maxDate = dayjs('2024-10-21');

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

  const getMetrics = async (start_date, end_date) => {
    try {
      const res = await axios.get(`http://localhost:5000/metrics?field=Close&start_date=${start_date}&end_date=${end_date}`);
      setMetrics([
        {
          min: res.data.min,
          max: res.data.max,
          avg: res.data.avg,
          stdDev: res.data.stdDev,
        },
      ]);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
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
      getMetrics(startDate, endDate);
    }
  }, [startDate, endDate]);

  const dateTickFormatter = (date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  return (
    <>
      <div className='row-span-3 col-span-2 w-full h-full rounded-md relative p-2 border-2 bg-gray-900 border-gray-800'>
        <div className="w-full h-full p-4">
        <div className="flex items-center mb-4 gap-4">
          <label>
            Start Date:
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="ml-2 p-1 rounded border-2 border-gray-300 bg-gray-800 text-gray-100"
            />
          </label>
          <label>
            End Date:
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="ml-2 p-1 rounded border-2 border-gray-300 bg-gray-800 text-gray-100"
            />
          </label>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <h1 className='text-xl text-center text-gray-300'>Close Value</h1>
          <AreaChart data={closeData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
            <XAxis dataKey="Date" tickFormatter={dateTickFormatter} minTickGap={15} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="Close" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      </div>
      <div className='row-span-3 col-span-1 w-full h-full rounded-md relative p-8 border-2 bg-gray-900 border-gray-800'>
        <ResponsiveContainer width="100%" height={400}>
          <h1 className='text-xl text-center text-gray-300'>Close Value Metrics</h1>
          <BarChart data={metrics} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} layout='horizontal'>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="min" fill="#8884d8" name="Min" />
            <Bar dataKey="max" fill="#82ca9d" name="Max" />
            <Bar dataKey="avg" fill="#ffc658" name="Avg" />
            <Bar dataKey="stdDev" fill="#ff7300" name="Std Dev" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
    
  );
};

export default CloseValueLAreaChart;
