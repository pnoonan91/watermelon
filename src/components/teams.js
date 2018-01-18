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

  startGame(e) {
    const gameStatus = firebase.database().ref('games').child(`/${this.state.gameId}`)
    gameStatus.update({status: 'playing'})

    history.push(`/play/${this.state.currentGame}`)
  }

  render() {
    return (
      <div>
        <h1>Teams Component!</h1>
        <div>
          <div>
            <h4>Unassigned Players:</h4>
            <table>
              {
                this.state.players.map(player => {
                  if (player.team === '') {
                    return <tbody key={player.id}>
                      <tr>
                        <td>{player.name}</td>
                        <td>
                          <select onChange={this.assignTeam} name={player.id}>
                            <option>Assign a Team!</option>
                            <option value="A">Team A</option>
                            <option value="B">Team B</option>
                          </select>
                        </td>
                      </tr>
                    </tbody>
                  }
                })
              }
            </table>
          </div>
          <div>
            <h4>TEAM A:</h4>
            <table>
              {
                this.state.players.map(player => {
                  if (player.team === 'A') {
                    return <tbody key={player.id}>
                      <tr>
                        <td>{player.name}</td>
                      </tr>
                    </tbody>
                  }
                })
              }
            </table>
            <h4>TEAM B:</h4>
            <table>
              {
                this.state.players.map(player => {
                  if (player.team === 'B') {
                    return <tbody key={player.id}>
                      <tr>
                        <td>{player.name}</td>
                      </tr>
                    </tbody>
                  }
                })
              }
            </table>
          </div>
        </div>
        <button onClick={this.startGame} name={this.state.currentGame}>Start Game!</button>
      </div>
    )
  }
}

export default Teams
