import React from 'react';
import Navbar from './components/Navbar';
import CloseValueLAreaChart from './components/CloseValueLAreaChart';
import CloseOpenCorrelation from './components/CloseOpenCorrelation';
import VolumeCloseLineChart from './components/VolumeCloseLineChart';

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-8 md:grid-rows-7 xl:grid-rows-5 auto-rows-fr gap-6 p-10 bg-gray-900 text-gray-300'>
        <CloseValueLAreaChart />
        <CloseOpenCorrelation />
        <VolumeCloseLineChart />
      </div>
    </>
  );
};

export default Dashboard;
