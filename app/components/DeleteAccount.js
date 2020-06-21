import React, { useEffect, useContext } from 'react';
import Page from './Page';
import StateContext from '../StateContext';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import { withRouter } from 'react-router-dom';

function DeleteAccount(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  async function handleDeleteAccount() {
    const areYouSure = confirm('Are you sure?');
    const request = Axios.CancelToken.source();

    if (areYouSure) {
      const response = await Axios.post('/delete-account', { userId: appState.user._id, token: appState.user.token }, { cancelToken: request.token });
      if (response.data == 'Success') {
        props.history.push('/')
        appDispatch({ type: 'flashMessage', value: 'Account successfully deleted.' });
        appDispatch({ type: 'logout' });
      } else {
        appDispatch({ type: 'flashMessageError', value: 'Delete failed. Please try again.' });
      }
    }
  }

  return (
    <Page title='Delete Account'>
      <div className='inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center'>
        <div className='bg-white rounded-lg overflow-hidden border border-gray-200 transform transition-all sm:max-w-lg sm:w-full' role='dialog' aria-modal='true' aria-labelledby='modal-headline'>
          <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                <svg className='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
                </svg>
              </div>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <h3 className='text-lg leading-6 font-medium text-gray-900' id='modal-headline'>
                  Delete account
                </h3>
                <div className='mt-2'>
                  <p className='text-sm leading-5 text-gray-500'>Are you sure you want to delete your account? All of your data will be permanently removed, except for bids that you already made. This action cannot be undone.</p>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <span className='flex w-full rounded-md sm:ml-3 sm:w-auto'>
              <button onClick={handleDeleteAccount} type='button' className='inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5'>
                Delete
              </button>
            </span>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default withRouter(DeleteAccount);
