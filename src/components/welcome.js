import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

class Welcome extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="/images/watermelon_logo.png" className="App-logo" alt="logo" />
          <h1 className="App-title no-margin">watermelon</h1>
        </header>
        <div id="landing-page-options">
          <div id="options-container">
            <h1 className="App-subtitle">A hilariously addicting party game for groups of 4 or more!</h1>
            <div className="option">
              <Link to="/game">Start a Game</Link>
            </div>
            <div className="option">
              <Link to="/join">Join a Game</Link>
            </div>
            <div className="option">
              <Link to="/rules">Rules</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Welcome
