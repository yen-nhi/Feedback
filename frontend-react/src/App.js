import './App.css';
import { Switch, Route, useHistory } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clientActions } from './store/client';
import EndpointContext, { EndpointProvider } from './store/api-endpoint';

import Login from './pages/Login';
import Layout from './layout/Layout';
import NotFound from './pages/NotFound';
import Survey from './pages/Survey';
const Home = React.lazy(() => import('./pages/Home'));
const Thankyou = React.lazy(() => import('./pages/Thankyou'));
const SignUp = React.lazy(() => import('./pages/Signup'));
const NewSurvey = React.lazy(() => import('./pages/NewSurvey'));
const Account = React.lazy(() => import('./pages/Account'));
const ClientSurvey = React.lazy(() => import('./components/surveys/ClientSurvey'));
const Report = React.lazy(() => import('./pages/Report'));


function App() {

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  console.log('isAuthenticated', isAuthenticated);
  const apiRoot = React.useContext(EndpointContext);
  const history = useHistory();


  useEffect( () => {
      const currentToken = localStorage.getItem('token');

      if (currentToken) {
        fetch(`${apiRoot.url}/accounts/verification`, {
          headers: {'Content-Type': 'application/json',
                    'Authorization': currentToken}})
        .then(response => response.json()).then(result => {
          if (result.status === 'OK') {
            history.replace('/account');
            dispatch(clientActions.login({token: currentToken}));
          } else {
            dispatch(clientActions.logout());
          }
        });
      }
    }, [apiRoot.url, dispatch, history]);


   
  return (
    <EndpointProvider>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>
          <Switch>
            <Route path='/' exact>
              <Home/>
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
              <NewSurvey/>
            </Route>
            <Route exact path='/account'>
              <Account/>
            </Route>
            <Route path='/account/surveys/:surveyID'>
              <ClientSurvey/>
            </Route>
            <Route path='/account/reports/:surveyID'>
              <Report/>
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Suspense>
      </Layout>
    </EndpointProvider>
  );
}

export default App;
