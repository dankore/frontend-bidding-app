import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '../../components/shared/Page';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import DispatchContext from '../../DispatchContext';
import StateContext from '../../StateContext';
import { CSSTransition } from 'react-transition-group';
import LoadingDotsIcon from '../shared/LoadingDotsIcon';

function EditUserProfileInfo(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const initialState = {
    profileData: {
      profileUsername: {
        value: '...',
        hasErrors: false,
        message: '',
        isUnique: false,
        checkCount: 0,
      },
      profileFirstName: {
        value: '...',
        hasErrors: false,
        message: '',
      },
      profileLastName: {
        value: '...',
        hasErrors: false,
        message: '',
      },
      profileAvatar: 'https://gravatar.com/avatar/palceholder?s=128',
      isFollowing: false,
      counts: {
        projectCount: '',
        followerCount: '',
        followingCount: '',
      },
    },
    isLoading: true,
    isSaving: false,
    submitCount: 0,
  };

  function Reducer(draft, action) {
    switch (action.type) {
      case 'fetchDataComplete':
        draft.profileData.profileUsername.value = action.value.profileUsername;
        draft.profileData.profileFirstName.value = action.value.profileFirstName;
        draft.profileData.profileLastName.value = action.value.profileLastName;
        draft.profileData.profileAvatar = action.value.profileAvatar;
        return;
      // USERNAME
      case 'usernameImmediately':
        draft.profileData.profileUsername.hasErrors = false;
        draft.profileData.profileUsername.value = action.value;

        if (draft.profileData.profileUsername.value.length > 30) {
          draft.profileData.profileUsername.hasErrors = true;
          draft.profileData.profileUsername.message = 'Username cannot exceed 30 characters.';
        }
        if (draft.profileData.profileUsername.value && !/^([a-zA-Z0-9]+)$/.test(draft.profileData.profileUsername.value)) {
          draft.profileData.profileUsername.hasErrors = true;
          draft.profileData.profileUsername.message = 'Username can only contain letters and numbers.';
        }
        return;
      case 'usernameAfterDelay':
        if (draft.profileData.profileUsername.value.length < 3) {
          draft.profileData.profileUsername.hasErrors = true;
          draft.profileData.profileUsername.message = 'Username must be at least 3 characters.';
        }
        if (!draft.hasErrors && !action.noNeedToSendAxiosRequest) {
          draft.profileData.profileUsername.checkCount++;
        }
        return;
      case 'usernameIsUnique':
        if (action.value) {
          if (draft.profileData.profileUsername.value == appState.user.username) {
            draft.profileData.profileUsername.isUnique = true;
          } else {
            draft.profileData.profileUsername.hasErrors = true;
            draft.profileData.profileUsername.isUnique = false;
            draft.profileData.profileUsername.message = 'That username is already being used.';
          }
        } else {
          draft.profileData.profileUsername.isUnique = true;
        }
        return;
      // FIRST NAME
      case 'firstnameImmediately':
        draft.profileData.profileFirstName.hasErrors = false;
        draft.profileData.profileFirstName.value = action.value;

        if (draft.profileData.profileFirstName.value.length == '') {
          draft.profileData.profileFirstName.hasErrors = true;
          draft.profileData.profileFirstName.message = 'First name field cannot be empty.';
        }
        if (/[^a-zA-Z]/.test(draft.profileData.profileFirstName.value.trim())) {
          draft.profileData.profileFirstName.hasErrors = true;
          draft.profileData.profileFirstName.message = 'First name can only be letters.';
        }
        if (draft.profileData.profileFirstName.value.length > 50) {
          draft.profileData.profileFirstName.hasErrors = true;
          draft.profileData.profileFirstName.message = 'First name cannot exceed 50 characters.';
        }
        return;
      // LAST NAME
      case 'lastnameImmediately':
        draft.profileData.profileLastName.hasErrors = false;
        draft.profileData.profileLastName.value = action.value;

        if (draft.profileData.profileLastName.value.length == '') {
          draft.profileData.profileLastName.hasErrors = true;
          draft.profileData.profileLastName.message = 'Last name field cannot be empty.';
        }
        if (/[^a-zA-Z]/.test(draft.profileData.profileLastName.value.trim())) {
          draft.profileData.profileLastName.hasErrors = true;
          draft.profileData.profileLastName.message = 'Last name can only be letters.';
        }
        if (draft.profileData.profileLastName.value.length > 50) {
          draft.profileData.profileLastName.hasErrors = true;
          draft.profileData.profileLastName.message = 'Last name cannot exceed 50 characters.';
        }
        return;
      case 'isLoadingFinished':
        draft.isLoading = false;
        return;
      case 'isSavingUpdateStart':
        draft.isSaving = true;
        return;
      case 'isSavingUpdateFinished':
        draft.isSaving = false;
        return;
      // SUBMIT
      case 'submitForm':
        if (!draft.profileData.profileUsername.hasErrors && draft.profileData.profileUsername.isUnique && !draft.profileData.profileFirstName.hasErrors && draft.profileData.profileFirstName.value != '' && !draft.profileData.profileLastName.hasErrors && draft.profileData.profileLastName.value != '') {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);

  // DELAY: USERNAME
  useEffect(() => {
    if (state.profileData.profileUsername.value) {
      const delay = setTimeout(() => dispatch({ type: 'usernameAfterDelay' }), 800);

      return () => clearTimeout(delay);
    }
  }, [state.profileData.profileUsername.value]);

  // USERNAME IS UNIQUE
  useEffect(() => {
    if (state.profileData.profileUsername.checkCount) {
      const request = Axios.CancelToken.source();
      (async function checkForUsername() {
        try {
          const response = await Axios.post('/doesUsernameExist', { username: state.profileData.profileUsername.value }, { cancelToken: request.token });
          dispatch({ type: 'usernameIsUnique', value: response.data });
        } catch (error) {
          console.log('Having difficulty looking up your username. Please try again.');
        }
      })();
      // CANCEL REQUEST
      return () => request.cancel();
    }
  }, [state.profileData.profileUsername.checkCount]);

  // FETCH USER INFO
  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${appState.user.username}`, { token: appState.user.token }, { CancelToken: request.token });
        if (response.data) {
          dispatch({ type: 'fetchDataComplete', value: response.data });
          dispatch({ type: 'isLoadingFinished' });
        } else {
          props.history.push('/');
          appDispatch({ type: 'flashMessageError', value: 'User does not exist.' });
        }
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => request.cancel();
  }, []);

  // SUBMIT FORM
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      (async function submitProfileUpdate() {
        try {
          dispatch({ type: 'isSavingUpdateStart' });
          const response = await Axios.post(
            '/updateProfileInfo',
            {
              _id: appState.user._id,
              username: state.profileData.profileUsername.value,
              firstName: state.profileData.profileFirstName.value,
              lastName: state.profileData.profileLastName.value,
              token: appState.user.token,
            },
            { cancelToken: request.token }
          );
          dispatch({ type: 'isSavingUpdateFinished' });
          if (response.data._id) {
            appDispatch({ type: 'updateUserInfo', data: response.data });
            appDispatch({ type: 'flashMessage', value: 'Profile updated.' });
          } else {
            appDispatch({ type: 'flashMessageError', value: response.data });
          }
        } catch (e) {
          appDispatch({ type: 'flashMessageError', value: 'Profile update failed. Please try again.' });
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'usernameImmediately', value: state.profileData.profileUsername.value });
    dispatch({ type: 'usernameAfterDelay', value: state.profileData.profileUsername.value, noNeedToSendAxiosRequest: true });

    dispatch({ type: 'firstnameImmediately', value: state.profileData.profileFirstName.value });
    dispatch({ type: 'lastnameImmediately', value: state.profileData.profileLastName.value });

    dispatch({ type: 'submitForm' });
  }

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  // CSS
  const CSSTransitionStyle = { color: '#e53e3e', fontSize: 0.75 + 'em' };

  return (
    <Page title='Edit Profile Info'>
      <div className='max-w-lg mx-auto -mt-6 bg-white lg:rounded-lg shadow'>
        <form onSubmit={handleSubmit} className='mx-auto p-3 rounded'>
          <div className='flex flex-wrap'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='username'>
                Username <span className='text-red-600'>*</span>
              </label>
              <input value={state.profileData.profileUsername.value} onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' autoComplete='off' spellCheck='false' className='shadow-inner appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='username' type='text' />
              <CSSTransition in={state.profileData.profileUsername.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.profileData.profileUsername.message}
                </div>
              </CSSTransition>
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='first-name'>
                First Name <span className='text-red-600'>*</span>
              </label>
              <input value={state.profileData.profileFirstName.value} onChange={e => dispatch({ type: 'firstnameImmediately', value: e.target.value })} id='first-name' autoComplete='off' spellCheck='false' className='shadow-inner appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
              <CSSTransition in={state.profileData.profileFirstName.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.profileData.profileFirstName.message}
                </div>
              </CSSTransition>
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='last-name'>
                Last Name <span className='text-red-600'>*</span>
              </label>
              <input value={state.profileData.profileLastName.value} onChange={e => dispatch({ type: 'lastnameImmediately', value: e.target.value })} id='last-name' autoComplete='off' className='shadow-inner appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='last-name' type='text' />
              <CSSTransition in={state.profileData.profileLastName.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.profileData.profileLastName.message}
                </div>
              </CSSTransition>
            </div>
            <button type='submit' className='relative w-full m-3 inline-flex items-center justify-center py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              <svg className='h-5 w-5 text-blue-300 mr-1 transition ease-in-out duration-150' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z'></path>
                <polyline points='17 21 17 13 7 13 7 21'></polyline>
                <polyline points='7 3 7 8 15 8'></polyline>
              </svg>
              {state.isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default withRouter(EditUserProfileInfo);
