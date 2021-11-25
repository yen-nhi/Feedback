import './App.css';
import { Switch, Route } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { clientActions } from './store/client';
import EndpointContext, { EndpointProvider } from './store/api-endpoint';

import Layout from './layout/Layout';
const Opening = React.lazy(() => import('./pages/Opening'));
const Survey = React.lazy(() => import('./pages/Survey'));
const Home = React.lazy(() => import('./pages/Home'));
const Thankyou = React.lazy(() => import('./pages/Thankyou'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/Signup'));
const NewSurvey = React.lazy(() => import('./pages/NewSurvey'));
const Account = React.lazy(() => import('./pages/Account'));
const ClientSurvey = React.lazy(() => import('./components/ClientSurvey'));
const Report = React.lazy(() => import('./pages/Report'));

function App() {

  const dispatch = useDispatch();
  const apiRoot = React.useContext(EndpointContext);

  useEffect( () => {
      const currentToken = localStorage.getItem('token');
      const currentID = localStorage.getItem('id');

      if (currentToken && currentID) {
        fetch(`${apiRoot.url}/token-expiration/${currentID}/${currentToken}`)
        .then(response => response.json()).then(result => {
          if (result.message === 'VALID') {
            dispatch(clientActions.login({id: currentID, token: currentToken}));
          } 
        });
      }
    }, [apiRoot.url, dispatch]);

  return (
    <EndpointProvider>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path='/' exact>
              <Home/>
            </Route>
            <Route path='/survey' exact>
              <Opening />
            </Route>
            <Route path='/survey/:surveyID'>
              <Survey />
            </Route>
            <Route path='/thankyou'>
              <Thankyou />
            </Route>
            <Route path='/login'>
              <Login />
            </Route>
            <Route path='/signup'>
              <SignUp />
            </Route>
            <Route path='/new-survey'>
              <NewSurvey />
            </Route>
            <Route exact path='/account/:clientID'>
              <Account />
            </Route>
            <Route path='/account/:clientID/surveys/:surveyID'>
              <ClientSurvey/>
            </Route>
            <Route path='/account/:clientID/reports/:surveyID'>
              <Report/>
            </Route>
          </Switch>
        </Suspense>
      </Layout>
    </EndpointProvider>
  );
}

export default App;
