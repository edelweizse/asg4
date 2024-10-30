import React from 'react'
import { XAxis, YAxis, Line, Tooltip, ResponsiveContainer, LineChart, Bar, BarChart, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const CloseOpenCorrelation = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [startDate, setStartDate] = useState('2008-03-19');
  const [endDate, setEndDate] = useState('2024-10-21');
  const minDate = dayjs('2008-03-19');
  const maxDate = dayjs('2024-10-21');

  const getCombinedData = async (start_date, end_date) => {
    try {
      const [closeRes, openRes] = await Promise.all([
        axios.get(`http://localhost:5000/data?field=Close&start_date=${start_date}&end_date=${end_date}`),
        axios.get(`http://localhost:5000/data?field=Open&start_date=${start_date}&end_date=${end_date}`),
      ])
      const formattedCloseData = closeRes.data.map(item => ({
        Date: dayjs(item.Date).format('YYYY-MM-DD'),
        Close: item.Close,
      }))
      const formattedOpenData = openRes.data.map(item => ({
        Date: dayjs(item.Date).format('YYYY-MM-DD'),
        Open: item.Open,
      }))

      const combinedData = formattedCloseData.map(closeItem => {
        const openItem = formattedOpenData.find(openItem => openItem.Date === closeItem.Date);
        return {
          ...closeItem,
          Open: openItem ? openItem.Open : null,
          CloseOpenDiff: openItem ? closeItem.Close - openItem.Open : null,
        }
      })

      setCombinedData(combinedData);
      calculateMetrics(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const calculateMetrics = (data) => {
    const closeOpenDiffs = data.map(item => item.CloseOpenDiff).filter(diff => diff !== null);
    const min = Math.min(...closeOpenDiffs);
    const max = Math.max(...closeOpenDiffs);
    const avg = closeOpenDiffs.reduce((acc, diff) => acc + diff, 0) / closeOpenDiffs.length;
    const stdDev = Math.sqrt(closeOpenDiffs.reduce((acc, diff) => acc + Math.pow(diff - avg, 2), 0) / closeOpenDiffs.length);

    setMetrics([
      {
        min: min,
        max: max,
        avg: avg,
        stdDev: stdDev,
      }
    ]);
  }

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
      getCombinedData(startDate, endDate);
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
          <h1 className='text-xl text-center text-gray-300'>Close-Open diff</h1>
          <LineChart data={combinedData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="Date" tickFormatter={dateTickFormatter} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="CloseOpenDiff" stroke="#ff7300" name="Close - Open" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      </div>
      <div className='row-span-3 col-span-1 w-full h-full rounded-md relative p-8 border-2 bg-gray-900 border-gray-800'>
        <ResponsiveContainer width="100%" height={400}>
          <h1 className='text-xl text-center text-gray-300'>Close-Open Diff Metrics</h1>
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
  )
}

export default CloseOpenCorrelation