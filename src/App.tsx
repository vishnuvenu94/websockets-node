import React from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';

import HostComponent from './components/host';
import HomeComponent from './components/home';
import ParticipantComponent from './components/participant';

export const ws = new WebSocket('ws://localhost:9090');

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={HomeComponent} />

        <Route
          exact
          path='/host/:hostName/:hostId/:sessionId'
          component={HostComponent}
        />
        <Route
          exact
          path='/participant/:sessionId'
          component={ParticipantComponent}
        />
      </Switch>
    </div>
  );
}

export default App;
