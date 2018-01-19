import React, { Component } from 'react'
import '../App.css'
import firebase from '../firebase.js'
import { Link } from 'react-router-dom'

class NewGame extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentGame: '',
      players: [],
      status: ''
    }

    this.generateGameId = this.generateGameId.bind(this)
  }

  componentDidMount() {
    const gameId = {gameId: this.generateGameId(), status: 'waiting', round: 'Round 1', currentPlayer: ''}
    const gameRef = firebase.database().ref('games')
    gameRef.push(gameId)
    this.setState({currentGame: ''+gameId.gameId, status: gameId.status})

    const playersRef = firebase.database().ref('players')
    playersRef.on('value', (snapshot) => {
      let players = snapshot.val()
      let newState = []
      for (let player in players) {
        if (players[player].gameId === this.state.currentGame) {
          newState.push({
            id: player,
            name: players[player].name,
            team: players[player].team
          })
        }
      }
      this.setState({players: newState})
    })
  }

  generateGameId() {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  render() {
    return (
      <div>
        <div id="new-game-pane">
          <div>
            <img id="new-game-logo" src="/images/watermelon_logo.png" alt="logo" />
          </div>
          <div className="margin-spacing center-div">
            <div>
              <div id="join-game">Join This Game!</div>
              <div id="game-id-display">{this.state.currentGame}</div>
            </div>
            <Link to={`/teams/${this.state.currentGame}`}>
              <div>
                <h1 id="start-game-text">Assign Teams!</h1>
                <div>
                  <img src="/images/start-game-icon.png" className="Start-logo" alt="start game logo" />
                </div>
              </div>
            </Link>
          </div>
          <div className="margin-spacing">
            <h1 className="header">Players</h1>
            <ul>
              {
                this.state.players.length
                  ? this.state.players.map(player => (
                    <li key={player.id} className="player-li">{player.name}</li>
                  ))
                  : <li>Waiting for players to join the game...</li>
              }
            </ul>
          </div>
        </div>
        <div className="light-green-div" />
        <div className="dark-green-div" />
      </div>
    )
  }
}

export default NewGame
