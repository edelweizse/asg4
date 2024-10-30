import React from 'react'
import { Link } from 'react-router-dom'
import Container from './Container'

const Navbar = () => {
  return (
    <Container>
      <div className='xl:px-32 flex justify-between text-slate-200'>
        <h1 className='xl:text-2xl md:text-xl text-base '>Visa Stocks Analysis</h1>
        <div className='flex gap-x-10'>
          <Link to='/' className='xl:text-xl md:text-base text-sm'>Dashboard</Link>
          <Link to='/predicts' className='xl:text-xl md:text-base text-sm'>Predictions</Link>
        </div>
      </div>
    </Container>
  )
}

export default Navbar