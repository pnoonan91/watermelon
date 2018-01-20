import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import CountUp from 'react-countup'
import firebase from '../firebase'
import history from './history'

class GameOver extends Component {
  constructor() {
    super()

    this.state = {
      teamAPoints: -1,
      teamBPoints: -1
    }

    this.showWinner = this.showWinner.bind(this)
    this.endGame = this.endGame.bind(this)
    this.rematch = this.rematch.bind(this)
    this.newGame = this.newGame.bind(this)
  }

  async componentDidMount() {
    const gamesRef = firebase.database().ref('games')
    await gamesRef.once('value', (snapshot) => {
      const games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === this.props.match.params.currentGame) {
          this.setState({
            teamAPoints: games[game].teamAScore,
            teamBPoints: games[game].teamBScore
          })
        }
      }
    })
  }

  componentWillUnmount() {
    this.setState({
      teamAPoints: -1,
      teamBPoints: -1
    })
  }

  showWinner() {
    let winner
    (this.state.teamAPoints > this.state.teamBPoints) ? winner = 'a-team' : winner = 'b-team'

    let winnerNode = document.getElementById(winner)

    if (winner === 'a-team') {
      winnerNode.style.transform = 'translate(180px) scale(1.25)'
      document.getElementById('b-team').style.transform = 'translate(300px) scale(.5)'
    } else {
      winnerNode.style.transform = 'translate(-180px) scale(1.25)'
      document.getElementById('a-team').style.transform = 'translate(-300px) scale(.5)'
    }

    let buttons = document.getElementsByClassName('game-over-button')

    for (let i = 0; i<buttons.length; i++) {
      buttons[i].style.visibility = 'visible'
      buttons[i].style.opacity = 1
    }
  }

  async rematch() {
    let gameId = this.props.match.params.currentGame

    await firebase.database().ref('games').once('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === gameId) {
          firebase.database().ref('games').child(`/${game}`).update({
            activePlayer: '',
            round: 'Round 1',
            roundDescription: 'During Round 1 you can say anything BUT the word you\'re trying to get your teammates to guess',
            roundName: 'Taboo',
            status: 'waiting',
            teamAScore: 0,
            teamBScore: 0
          })
        }
      }
    })

    await firebase.database().ref('clues').once('value', (snapshot) => {
      let clues = snapshot.val()
      for (let clue in clues) {
        if (clues[clue].gameId === gameId) {
          firebase.database().ref('clues').child(`/${clue}`).remove()
        }
      }
    })

    await firebase.database().ref('players').once('value', (snapshot) => {
      let players = snapshot.val()
      for (let player in players) {
        if (players[player].gameId === gameId) {
          firebase.database().ref('players').child(`/${player}`).update({
            activePlayer: false,
            enterClues: true
          })
        }
      }
    })

    history.push(`/play/${gameId}`)

  }

  async newGame() {
    let gameId = this.props.match.params.currentGame

    await firebase.database().ref('games').once('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === gameId) {
          firebase.database().ref('games').child(`/${game}`).update({
            activePlayer: '',
            round: 'Round 1',
            roundDescription: 'During Round 1 you can say anything BUT the word you\'re trying to get your teammates to guess',
            roundName: 'Taboo',
            status: 'waiting',
            teamAScore: 0,
            teamBScore: 0,
            redirectToWaiting: true
          })
        }
      }
    })

    await firebase.database().ref('clues').once('value', (snapshot) => {
      let clues = snapshot.val()
      for (let clue in clues) {
        if (clues[clue].gameId === gameId) {
          firebase.database().ref('clues').child(`/${clue}`).remove()
        }
      }
    })

    await firebase.database().ref('players').once('value', (snapshot) => {
      let players = snapshot.val()
      for (let player in players) {
        if (players[player].gameId === gameId) {
          firebase.database().ref('players').child(`/${player}`).update({
            activePlayer: false,
            enterClues: true,
            team: ''
          })
        }
      }
    })

    history.push(`/teams/${gameId}`)
  }

  async endGame() {
    let gameId = this.props.match.params.currentGame

    await firebase.database().ref('clues').once('value', (snapshot) => {
      let clues = snapshot.val()
      for (let clue in clues) {
        if (clues[clue].gameId === gameId) {
          firebase.database().ref('clues').child(`/${clue}`).remove()
        }
      }
    })

    await firebase.database().ref('games').once('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === gameId) {
          firebase.database().ref('clues').child(`/${game}`).remove()
        }
      }
    })

    await firebase.database().ref('players').once('value', (snapshot) => {
      let players = snapshot.val()
      for (let player in players) {
        if (players[player].gameId === gameId) {
          firebase.database().ref('clues').child(`/${player}`).remove()
        }
      }
    })

    history.push('/')
  }

  render() {
    return (
      <div id="gameplay-component">
        <div id="game-over-container">
          <h1 id="gameplay-header" className="no-margin">Game Over!</h1>
          <div className="game-over-score-container">
            <div className="score-container" id="a-team">
              <h1 className="game-over-header no-margin">Team A</h1>
              {
                (this.state.teamAPoints >= 0)
                  ? <CountUp duration={5} start={0} end={this.state.teamAPoints} useEasing={true} onComplete={this.showWinner} className="scoreboard-font" />
                  : <span />
              }
            </div>
            <div className="score-container" id="b-team">
              <h1 className="game-over-header no-margin">Team B</h1>
              {
                (this.state.teamBPoints >= 0)
                  ? <CountUp duration={5} start={0} end={this.state.teamBPoints} useEasing={true} className="scoreboard-font" />
                  : <span />
              }
            </div>
          </div>
          <div className="game-over-score-container">
            <button className="game-over-button" onClick={this.rematch}>Rematch</button>
            <button className="game-over-button" onClick={this.newGame}>New Teams</button>
            <button className="game-over-button" onClick={this.endGame}>End Game</button>
          </div>
        </div>
      </div>
    )
  }
}

export default GameOver
