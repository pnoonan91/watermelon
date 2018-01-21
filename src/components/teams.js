import React, { Component } from 'react'
import '../App.css'
import firebase from '../firebase.js'
import history from './history'

class Teams extends Component {
  constructor() {
    super()

    this.state = {
      currentGame: '',
      gameId: '',
      players: [],
      status: 'waiting'
    }

    this.assignTeam = this.assignTeam.bind(this)
    this.removePlayer = this.removePlayer.bind(this)
    this.startGame = this.startGame.bind(this)
  }

  componentDidMount() {
    this.setState({currentGame: this.props.match.params.currentGame})

    const gameRef = firebase.database().ref('games')
    gameRef.once('value', (snapshot) => {
      let games = snapshot.val()
      let newState
      for (let game in games) {
        if (games[game].gameId === this.props.match.params.currentGame) {
          newState = game
        }
      }
      this.setState({gameId: newState})
    })

    const playersRef = firebase.database().ref('players')
    playersRef.on('value', (snapshot) => {
      let players = snapshot.val()
      let newState = []
      for (let player in players) {
        if (players[player].gameId === this.props.match.params.currentGame) {
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

  assignTeam(e) {
    const playersRef = firebase.database().ref('players').child(`/${e.target.name}`)

    playersRef.update({team: e.target.value})
  }

  removePlayer(e) {
    const playersRef = firebase.database().ref('players').child(`/${e.target.value}`)

    playersRef.update({team: ''})
  }

  startGame(e) {
    const gameStatus = firebase.database().ref('games').child(`/${this.state.gameId}`)
    gameStatus.update({status: 'playing'})

    history.push(`/play/${this.state.currentGame}`)
  }

  render() {
    return (
      <div id="gameplay-component">
        <div id="gameplay-container">
          <h1 id="gameplay-header" className="no-margin">Choose Your Teams!</h1>
          <div id="assignment-flex">
            <div>
              <h4 id="gameplay-subhead-left" className="no-margin">Unassigned Players:</h4>
              <table className="table-font">
                {
                  this.state.players.map(player => {
                    if (player.team === '') {
                      return <tbody key={player.id}>
                        <tr>
                          <td>{player.name}</td>
                          <td>
                            <select onChange={this.assignTeam} name={player.id} id="team-selector">
                              <option>Team</option>
                              <option value="A">A</option>
                              <option value="B">B</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    }
                  })
                }
              </table>
            </div>
            <div id="team-name-container">
              <h4 id="gameplay-subhead-left" className="no-margin">Team A:</h4>
              <table className="table-font">
                {
                  this.state.players.map(player => {
                    if (player.team === 'A') {
                      return <tbody key={player.id}>
                        <tr>
                          <td>{player.name}</td>
                          <td>
                            <button onClick={this.removePlayer} value={player.id} id="team-deselect">X</button>
                          </td>
                        </tr>
                      </tbody>
                    }
                  })
                }
              </table>
              <h4 id="gameplay-subhead-left" className="no-margin">Team B:</h4>
              <table className="table-font">
                {
                  this.state.players.map(player => {
                    if (player.team === 'B') {
                      return <tbody key={player.id}>
                        <tr>
                          <td>{player.name}</td>
                          <td>
                            <button onClick={this.removePlayer} value={player.id} id="team-deselect">X</button>
                          </td>
                        </tr>
                      </tbody>
                    }
                  })
                }
              </table>
            </div>
          </div>
          <button onClick={this.startGame} name={this.state.currentGame} id="start-game-btn">Start Game!</button>
        </div>
      </div>
    )
  }
}

export default Teams
