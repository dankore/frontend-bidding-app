import React, { useEffect, useContext } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import Project from '../components/Project';
import { activeNavCSS } from '../helpers/activeNavCSS';

function HomePage() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.get('/getHomeFeedIfNotLoggedIn', { CancelToken: request.token });
        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  // useEffect(() => {
  //   // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
  //   const request = Axios.CancelToken.source();

  //   (async function fetchDataByUsername() {
  //     try {
  //       const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { CancelToken: request.token });
  //       setState(draft => {
  //         draft.isLoading = false;
  //         draft.feed = response.data;
  //       });
  //     } catch (error) {
  //       appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
  //     }
  //   })();
  //   // CANCEL REQUEST
  //   return () => {
  //     request.cancel();
  //   };
  // }, []);

  // if (state.isLoading) {
  //   return <LoadingDotsIcon />;
  // }

  return (
    <Page title='Home'>
      <div className='mt-2 align-middle inline-block min-w-full'>
        <ul className='flex shadow mb-4'>
          <NavLink to='/allprojects' activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            All Projects: 4
          </NavLink>

          <NavLink to='/thoseifollow' activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            Those You Follow: 6
          </NavLink>
        </ul>

        <Switch>
          <Route path='/allprojects'>
            {state.feed.length > 0 ? (
              <>
                <div className=''>
                  {state.feed.map(project => {
                    return <Project project={project} key={project._id} />;
                  })}
                </div>
              </>
            ) : (
              <h2 className='text-2xl text-center'>No Projects posted at this time.</h2>
            )}
          </Route>
          <Route path='/thoseifollow'>
            <h2>THose you Follow</h2>
          </Route>
        </Switch>
      </div>
    </Page>
  );
}

export default HomePage;
