import React, { useContext } from 'react';
import Page from '../../components/shared/Page';
import { Link } from 'react-router-dom';
import StateContext from '../../StateContext';

function HowToBid() {
  const appState = useContext(StateContext);

  return (
    <Page margin='mx-2' title='How to Bid'>
      <div className='bg-white shadow lg:rounded-lg max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
        <p className='text-base leading-6 font-semibold text-blue-600 uppercase tracking-wide lg:text-center'>Welcome</p>
        <h2 className='mt-2 max-w-3xl text-2xl leading-8 font-semibold font-display text-gray-900 sm:text-3xl sm:leading-9 lg:max-w-4xl lg:text-4xl lg:leading-10 lg:mx-auto lg:text-center'>How To Bid</h2>
        <div className='mt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:mt-12'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>01</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Go to the homepage</p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>02</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Click on the project you want to bid on</p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>03</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Add your bid</p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>04</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Wait for the project owner to make a decision</p>
            </div>
          </div>
        </div>
        <div className='my-6 flex justify-center'>
          {!appState.loggedIn && (
            <Link to='/register' className='block  items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              Get Started
            </Link>
          )}

          <Link to='/' className='block ml-3 items-center justify-center px-4 py-2 border border-gray-400 text-base leading-6 font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
            Browse Projects
          </Link>
        </div>
      </div>
    </Page>
  );
}

export default HowToBid;
