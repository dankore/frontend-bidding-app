import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';

function Header() {
  const appState = useContext(StateContext);

  return (
    <header className='bg-blue-600'>
      <nav className={`flex items-center justify-between flex-wrap lg:max-w-2xl lg:mx-auto ${appState.loggedIn ? ' ' : 'py-1'}`}>
        <Link to='/' className='mx-auto lg:mx-0 block flex items-center text-white'>
          <i className='fas fa-home'></i>
          <span className='hidden lg:block ml-2 font-semibold text-xl tracking-tight'>Bid for my Projects</span>
        </Link>

        <div className='flex items-center justify-between mx-auto'>
          <Link className='mr-4 inline-block text-white hover:text-gray-400' to='/how-to-bid'>
            How To Bid
          </Link>
          <div className='inline-block text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
