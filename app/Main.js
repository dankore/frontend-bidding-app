import React, { useEffect, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Axios from 'axios';

// STATE MANAGEMENT
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
// STATE MANAGEMENT ENDS

// AXIOS COMMON URL
console.log(process.env.BACKENDURL);
Axios.defaults.baseURL = process.env.BACKENDURL || 'https://backend-bidding-app.herokuapp.com';

// COMPONENTS
import Header from './components/Header';
const HomePage = lazy(() => import('./pages/HomePage'));
import Footer from './components/Footer';
import About from './pages/AboutPage';
import Terms from './pages/TermsPage';
import HowToBid from './pages/HowToBidPage';
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
import NotFoundPage from './pages/NotFoundPage';
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CreateProject = lazy(() => import('./pages/CreateProject'));
const ViewSingleProject = lazy(() => import('./pages/ViewSingleProject'));
import FlashMessageSuccess from './components/FlashMessageSuccess';
const EditProjectPage = lazy(() => import('./pages/EditProjectPage'));
import FlashMessageErrors from './components/FlashMessageErrors';
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
import YouMustBeLoggedInToViewThisPage from './components/YouMustBeLoggedIntoViewThisPage';
import YouMustBeLoggedOutToViewThisPage from './components/YouMustBeLoggedOutToViewThisPage';
const CreateBid = lazy(() => import('./pages/CreateBid'));
const ViewSingleBid = lazy(() => import('./pages/ViewSingleBid'));
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LoadingDotsIcon from './components/LoadingDotsIcon';
import ResetYourPassword from './pages/ResetYourPassword';
import AccountRecoveryEnterPassword from './pages/AccountRecoveryEnterPassword';
const EditBidPage = lazy(() => import('./pages/EditBidPage'));
// COMPONENTS END

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('biddingApp-token')),
    flashMessages: [],
    flashMessageErrors: [],
    user: {
      _id: localStorage.getItem('biddingApp-id'),
      token: localStorage.getItem('biddingApp-token'),
      username: localStorage.getItem('biddingApp-username'),
      firstName: localStorage.getItem('biddingApp-firstname'),
      lastName: localStorage.getItem('biddingApp-lastname'),
      avatar: localStorage.getItem('biddingApp-avatar') || 'https://gravatar.com/avatar/palceholder?s=128',
      userCreationDate: localStorage.getItem('biddingApp-userCreationDate'),
    },
    isSideMenuOpen: false,
    isSettingsTabOpen: false,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'flashMessage':
        draft.flashMessages.push(action.value);
        return;
      case 'flashMessageError':
        draft.flashMessageErrors.push(action.value);
        return;
      case 'openNav':
        draft.isMenuOpen = !draft.isMenuOpen;
        return;
      case 'toggleSettingsTab':
        draft.isSettingsTabOpen = !draft.isSettingsTabOpen;
        return;
      case 'toggleSideMenu':
        draft.isSideMenuOpen = !draft.isSideMenuOpen;
        return;
      case 'alwaysCloseTheseMenus':
        draft.isSideMenuOpen = false;
        draft.isSettingsTabOpen = false;
        return;
      case 'updateUserInfo':
        localStorage.setItem('biddingApp-id', action.data._id);
        localStorage.setItem('biddingApp-username', action.data.username);
        localStorage.setItem('biddingApp-firstname', action.data.firstName);
        localStorage.setItem('biddingApp-lastname', action.data.lastName);
        localStorage.setItem('biddingApp-token', action.data.token);
        draft.user.username = action.data.username;
        draft.user.firstName = action.data.firstName;
        draft.user.lastName = action.data.lastName;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('biddingApp-id', state.user._id);
      localStorage.setItem('biddingApp-token', state.user.token);
      localStorage.setItem('biddingApp-username', state.user.username);
      localStorage.setItem('biddingApp-firstname', state.user.firstName);
      localStorage.setItem('biddingApp-lastname', state.user.lastName);
      localStorage.setItem('biddingApp-avatar', state.user.avatar);
      localStorage.setItem('biddingApp-userCreationDate', state.user.userCreationDate);
    } else {
      localStorage.removeItem('biddingApp-id');
      localStorage.removeItem('biddingApp-token');
      localStorage.removeItem('biddingApp-username');
      localStorage.removeItem('biddingApp-firstname');
      localStorage.removeItem('biddingApp-lastname');
      localStorage.removeItem('biddingApp-avatar');
      localStorage.removeItem('biddingApp-userCreationDate');
    }
  }, [state.loggedIn]);

  // CHECK TOKEN
  useEffect(() => {
    if (state.loggedIn) {
      const request = Axios.CancelToken.source();
      (async function getToken() {
        try {
          const response = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: request.token });
          if (!response.data) {
            dispatch({ type: 'logout' });
            dispatch({
              type: 'flashMessageError',
              value: 'Your session has expired. Please log in again.',
            });
          }
        } catch (e) {
          console.log('Problem verifying Token to properly secure your account.');
        }
      })();

      return () => request.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessageSuccess messages={state.flashMessages} />
          <FlashMessageErrors messages={state.flashMessageErrors} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route exact path='/'>
                <Redirect to='/browse' />
              </Route>
              <Route strict path='/browse'>
                <HomePage />
              </Route>
              <Route path='/create-project'>{state.loggedIn ? <CreateProject /> : <YouMustBeLoggedInToViewThisPage />}</Route>
              <Route path='/project/:id/edit' exact>
                <EditProjectPage />
              </Route>
              <Route path='/project/:id' exact>
                <ViewSingleProject />
              </Route>
              <Route path='/:projectId/bid/:bidId'>
                <ViewSingleBid />
              </Route>
              <Route path='/bid/:projectId/:bidId/edit'>{state.loggedIn ? <EditBidPage /> : <YouMustBeLoggedInToViewThisPage />}</Route>
              <Route path='/create-bid/:id' exact>
                {state.loggedIn ? <CreateBid /> : <YouMustBeLoggedInToViewThisPage />}
              </Route>
              <Route path='/profile/:username'>
                <ProfilePage />
              </Route>
              <Route path='/reset-password/:token'>{state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <AccountRecoveryEnterPassword />}</Route>
              <Route path='/reset-password' exact>
                {state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <ResetYourPassword />}
              </Route>
              <Route path='/about'>
                <About />
              </Route>
              <Route path='/terms'>
                <Terms />
              </Route>
              <Route path='/privacy'>
                <PrivacyPolicyPage />
              </Route>
              <Route path='/settings'>{state.loggedIn ? <SettingsPage /> : <YouMustBeLoggedInToViewThisPage />}</Route>
              <Route path='/how-to-bid'>
                <HowToBid />
              </Route>
              <Route path='/login'>{state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <LoginPage />}</Route>
              <Route path='/register'>{state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <RegistrationPage />}</Route>
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
          </Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.getElementById('app'));

// LOAD JAVASCRIPT FILE WITHOUT RELOADING THE PAGE
if (module.hot) {
  module.hot.accept();
}
