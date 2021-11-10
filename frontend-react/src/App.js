import './App.css';
import { Switch, Route } from 'react-router-dom';
import React, { useEffect, Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { clientActions } from './store/client';

import Layout from './layout/Layout';
const Opening = React.lazy(() => import('./pages/Opening'))
const Survey = React.lazy(() => import('./pages/Survey'))
const Home = React.lazy(() => import('./pages/Home'))
const Thankyou = React.lazy(() => import('./pages/Thankyou'))
const Login = React.lazy(() => import('./pages/Login'))
const SignUp = React.lazy(() => import('./pages/Signup'))
const NewSurvey = React.lazy(() => import('./pages/NewSurvey'))
const Account = React.lazy(() => import('./pages/Account'))
const ClientSurvey = React.lazy(() => import('./components/ClientSurvey'))

function App() {

  const dispatch = useDispatch();

  useEffect( () => {
      const currentToken = localStorage.getItem('token');
      const currentID = localStorage.getItem('id');

      if (currentToken && currentID) {
        fetch(`http://127.0.0.1:5000/token-expiration/${currentID}/${currentToken}`)
        .then(response => response.json()).then(result => {
          if (result.message === 'VALID') {
            dispatch(clientActions.login({id: currentID, token: currentToken}));
          } 
        });
      }
    }, []);

  return (
    <React.Fragment>
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
          </Switch>
        </Suspense>
      </Layout>
    </React.Fragment>
  );
}

export default App;