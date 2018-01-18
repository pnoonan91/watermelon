import React, { Component } from 'react'
import '../App.css'
import {Route, Switch, Router} from 'react-router-dom'
import Welcome from './welcome'
import history from './history'
import NewGame from './newgame'
import JoinGame from './joingame'
import Teams from './teams'

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/game" component={NewGame} />
          <Route exact path="/join" component={JoinGame} />
          <Route exact path="/teams/:currentGame" component={Teams} />
        </Switch>
      </Router>
    )
  }
}

export default App
