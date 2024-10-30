import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const VolumeCloseLineChart = () => {
  const [combinedData, setCombinedData] = useState([]);
  const [startDate, setStartDate] = useState('2008-03-19');
  const [endDate, setEndDate] = useState('2024-10-21');
  const minDate = dayjs('2008-03-19');
  const maxDate = dayjs('2024-10-21');

  const getCombinedData = async (start_date, end_date) => {
    try {
      const [closeRes, volumeRes] = await Promise.all([
        axios.get(`http://localhost:5000/data?field=Close&start_date=${start_date}&end_date=${end_date}`),
        axios.get(`http://localhost:5000/data?field=Volume&start_date=${start_date}&end_date=${end_date}`),
      ]);
      
      const formattedCloseData = closeRes.data.map(item => ({
        Date: dayjs(item.Date).format('YYYY-MM-DD'),
        Close: item.Close,
      }));
      
      const formattedVolumeData = volumeRes.data.map(item => ({
        Date: dayjs(item.Date).format('YYYY-MM-DD'),
        Volume: item.Volume,
      }));

      const combinedData = formattedCloseData.map(closeItem => {
        const volumeItem = formattedVolumeData.find(volumeItem => volumeItem.Date === closeItem.Date);
        return {
          ...closeItem,
          Volume: volumeItem ? volumeItem.Volume : null,
        };
      });

      // Normalize the combined data
      const normalizedData = normalizeData(combinedData);
      setCombinedData(normalizedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const normalizeData = (data) => {
    // Calculate min and max for Close and Volume
    const closeValues = data.map(item => item.Close);
    const volumeValues = data.map(item => item.Volume).filter(Boolean); // Exclude nulls for Volume

    const minClose = Math.min(...closeValues);
    const maxClose = Math.max(...closeValues);
    const minVolume = Math.min(...volumeValues);
    const maxVolume = Math.max(...volumeValues);
    
    // Normalize the data
    return data.map(item => ({
      ...item,
      Close: ((item.Close - minClose) / (maxClose - minClose)), // Normalize Close
      Volume: item.Volume ? ((item.Volume - minVolume) / (maxVolume - minVolume)) : null, // Normalize Volume
    }));
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
      getCombinedData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const dateTickFormatter = (date) => {
    return dayjs(date).format('MMM D, YYYY');
  };

  return (
    <>
      <div className='row-span-3 col-span-3 w-full h-full rounded-md relative p-2 border-2 bg-gray-900 border-gray-800'>
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
            <h1 className='text-xl text-center text-gray-300'>Close and Volume</h1>
            <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
              <XAxis dataKey="Date" tickFormatter={dateTickFormatter} minTickGap={15} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="Close" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="Volume" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}

export default VolumeCloseLineChart;
