import React, { Component } from 'react'
import '../App.css'

class App extends Component {
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
              Start a Game
            </div>
            <div className="option">
              Join a Game
            </div>
            <div className="option">
              Rules of the Game
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App