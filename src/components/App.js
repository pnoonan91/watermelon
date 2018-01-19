import React, { Component } from 'react'
import '../App.css'
import {Route, Switch, Router} from 'react-router-dom'
import Welcome from './welcome'
import history from './history'
import NewGame from './newgame'
import JoinGame from './joingame'
import Teams from './teams'
import GamePlay from './gameplay'
import WaitingRoom from './waiting'
import Controller from './controller'

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/game" component={NewGame} />
          <Route exact path="/join" component={JoinGame} />
          <Route exact path="/teams/:currentGame" component={Teams} />
          <Route exact path="/play/:currentGame" component={GamePlay} />
          <Route exact path="/waiting/:userId" component={WaitingRoom} />
          <Route exact path="/player/:userId" component={Controller} />
        </Switch>
      </Router>
    )
  }
}

export default App
