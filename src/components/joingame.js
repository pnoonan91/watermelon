import React, { Component } from 'react'
import '../App.css'
import firebase from '../firebase.js'
import history from './history'

class JoinGame extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
      gameId: '',
      userId: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillUnmount() {
    this.setState({
      name: '',
      gameId: '',
      userId: ''
    })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  async handleSubmit(e) {
    e.preventDefault()
    const playersRef = firebase.database().ref('players')
    const player = {
      name: this.state.name,
      gameId: this.state.gameId,
      team: '',
      activePlayer: false,
      enterClues: true
    }
    await playersRef.push(player)
    await playersRef.once('value', (snapshot) => {
      let players = snapshot.val()
      let newState
      for (let player in players) {
        if (players[player].gameId === this.state.gameId && players[player].name === this.state.name) {
          newState = player
        }
      }
      this.setState({userId: newState})
    })
    history.push(`/waiting/${this.state.userId}`)
  }

  render() {
    return (
      <div className="center-content tworem-padding waiting-room-component">
        <div id="waiting-container">
          <img src="/images/circle-watermelon-large.png" id="waiting-watermelon"/>
          <h1 id="waiting-text">Join Game!</h1>
          <form onSubmit={this.handleSubmit} id="join-form">
            <input type="text" name="name" placeholder="Enter a Name!" onChange={this.handleChange} value={this.state.name} className="controller-input"/>
            <input type="text" name="gameId" placeholder="What's your Game #?" onChange={this.handleChange} value={this.state.gameId} className="controller-input"/>
            <button type="submit" id="join-game-btn">Join Game!</button>
          </form>
        </div>
      </div>
    )
  }
}

export default JoinGame
