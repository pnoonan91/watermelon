import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import firebase from '../firebase'
import ReactCountdownClock from 'react-countdown-clock'
import history from './history'

class Controller extends Component {
  constructor() {
    super()

    this.state = {
      name: '',
      playerId: '',
      active: false,
      gameId: '',
      round: '',
      enterClues: true,
      roundName: '',
      roundDescription: '',
      roundStarted: false,
      pauseClock: true,
      clues: [],
      currentClue: {},
      roundPoints: 0,
      team: ''
    }

    this.enterClues = this.enterClues.bind(this)
    this.startRound = this.startRound.bind(this)
    this.endRound = this.endRound.bind(this)
    this.generateClue = this.generateClue.bind(this)
    this.correctAnswer = this.correctAnswer.bind(this)
    this.passClue = this.passClue.bind(this)
    this.nextRound = this.nextRound.bind(this)
    this.endGame = this.endGame.bind(this)
    this.resetClueStatus = this.resetClueStatus.bind(this)
  }

  async componentDidMount() {
    this.setState({playerId: this.props.match.params.userId})

    const playersRef = firebase.database().ref('players').child(`/${this.props.match.params.userId}`)
    await playersRef.once('value', (snapshot) => {
      let player = snapshot.val()
      this.setState({gameId: player.gameId, name: player.name, enterClues: player.enterClues, team: player.team})
    })

    const gameRef = firebase.database().ref('games')
    gameRef.on('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === this.state.gameId) {
          this.setState({round: games[game].round, roundName: games[game].roundName, roundDescription: games[game].roundDescription, gameFirebaseId: game})
        }
        if (games[game].redirectToWaiting === true) {
          firebase.database().ref('games').child(`/${game}`).update({
            redirectToWaiting: false
          })
          history.push(`/waiting/${this.props.match.params.userId}`)
        }
      }
    })

    playersRef.on('value', (snapshot) => {
      let player = snapshot.val()
      this.setState({active: player.activePlayer})
    })
  }

  async enterClues(e) {
    e.preventDefault()
    let clueArr = [e.target.one.value, e.target.two.value, e.target.three.value]

    const clueRef = firebase.database().ref('clues')
    await clueArr.forEach(clue => {
      clueRef.push({clue: clue, gameId: this.state.gameId, open: true})
    })

    const playerRef = firebase.database().ref('players').child(`/${this.props.match.params.userId}`)
    await playerRef.update({enterClues: false})

    this.setState({enterClues: false})
  }

  async startRound() {
    const clueRef = firebase.database().ref('clues')
    await clueRef.once('value', (snapshot) => {
      let clues = snapshot.val()
      let availableClues = []
      for (let clue in clues) {
        if (clues[clue].gameId === this.state.gameId && clues[clue].open === true) {
          availableClues.push({id: clue, clue: clues[clue].clue})
        }
      }
      this.setState({clues: availableClues})
    })

    this.setState({pauseClock: false, roundStarted: true})
    this.generateClue()
  }

  generateClue() {
    if (!this.state.clues.length) {
      this.nextRound()
    }
    else {
      let currentClue = this.state.clues.splice((Math.floor(Math.random() * this.state.clues.length)), 1)
      let clueValue = currentClue[0]
      this.setState({currentClue: {id: clueValue.id, clue: clueValue.clue}})
      firebase.database().ref('clues').child(`/${clueValue.id}`).update({open: false})
    }
  }

  correctAnswer() {
    this.setState({roundPoints: this.state.roundPoints+=10})
    this.generateClue()
  }

  passClue() {
    this.setState({roundPoints: this.state.roundPoints-=75})
    this.generateClue()
  }

  async nextRound() {
    let currentGame
    let currentRound
    await firebase.database().ref('games').once('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === this.state.gameId) {
          currentGame = game
          currentRound = games[game].round
        }
      }
    })

    let roundUpdate = firebase.database().ref('games').child(`/${currentGame}`)

    if (currentRound === 'Round 1') {
      await roundUpdate.update({
        round: 'Round 2',
        roundDescription: 'During Round 2 you can only say ONE WORD!',
        roundName: 'Password'
      })
      this.resetClueStatus()
    } else if (currentRound === 'Round 2') {
      await roundUpdate.update({
        round: 'Round 3',
        roundDescription: 'During Round 3 you can\'t use any words or sounds. Only motions and gestures!',
        roundName: 'Charades'
      })
      this.resetClueStatus()
    } else {
      this.endGame()
    }

    this.setState({
      pauseClock: true,
      roundStarted: false
    })
  }

  resetClueStatus() {
    firebase.database().ref('clues').once('value', (snapshot) => {
      const clues = snapshot.val()
      for (let clue in clues) {
        if (clues[clue].gameId === this.state.gameId) {
          firebase.database().ref('clues').child(`/${clue}`).update({open: true})
        }
      }
    })
  }

  async endRound() {
    let currentTeamScore
    await firebase.database().ref('games').child(`/${this.state.gameFirebaseId}`).once('value', (snapshot) => {
      const game = snapshot.val()
      if (this.state.team === 'A') {
        currentTeamScore = game.teamAScore
      } else {
        currentTeamScore = game.teamBScore
      }
    })

    let scoreUpdate = firebase.database().ref('games').child(`/${this.state.gameFirebaseId}`)

    if (this.state.team === 'A') {
      scoreUpdate.update({teamAScore: currentTeamScore + this.state.roundPoints})
    } else {
      scoreUpdate.update({teamBScore: currentTeamScore + this.state.roundPoints})
    }

    await firebase.database().ref('players').child(`/${this.props.match.params.userId}`).update({activePlayer: false})

    await firebase.database().ref('games').child(`/${this.state.gameFirebaseId}`).update({activePlayer: ''})

    await firebase.database().ref('clues').child(`/${this.state.currentClue.id}`).update({open: true})

    this.setState({
      pauseClock: true,
      roundStarted: false,
      active: false,
      roundPoints: 0,
      clues: [],
      currentClue: {}
    })
  }

  async endGame() {
    let currentTeamScore
    await firebase.database().ref('games').child(`/${this.state.gameFirebaseId}`).once('value', (snapshot) => {
      const game = snapshot.val()
      if (this.state.team === 'A') {
        currentTeamScore = game.teamAScore
      } else {
        currentTeamScore = game.teamBScore
      }
    })

    let scoreUpdate = firebase.database().ref('games').child(`/${this.state.gameFirebaseId}`)

    if (this.state.team === 'A') {
      scoreUpdate.update({teamAScore: currentTeamScore + this.state.roundPoints})
    } else {
      scoreUpdate.update({teamBScore: currentTeamScore + this.state.roundPoints})
    }

    await firebase.database().ref('players').child(`/${this.props.match.params.userId}`).update({activePlayer: false})

    await firebase.database().ref('games').child(`/${this.state.gameFirebaseId}`).update({
      round: 'Game Over',
      roundName: '',
      roundDescription: 'You should totally play again!',
      status: 'complete'
    })

    this.setState({
      pauseClock: true,
      roundStarted: false,
      active: false,
      roundPoints: 0,
      clues: [],
      currentClue: {}
    })

    firebase.database().ref('players').child(`/${this.props.match.params.userId}`).on('value', (snapshot) => {
      let player = snapshot.val()
      if (player.enterClues === true) {
        this.setState({
          enterClues: true
        })
      }
    })
  }

  render() {
    return (
      this.state.enterClues
        ? <div id="playing-component">
          <div id="playing-container">
            <div id="controller-header">Enter Your Clues</div>
            <form onSubmit={this.enterClues}>
              <input placeholder="people," className="controller-input" name="one"></input>
              <input placeholder="places," className="controller-input" name="two"></input>
              <input placeholder="or things!" className="controller-input" name="three"></input>
              <button className="controller-submit">submit clues</button>
            </form>
          </div>
        </div>
        : this.state.active
          ? <div id="playing-component">
            <div id="playing-container">
              <div id="controller-header">{this.state.name}</div>
              <div id="score-and-time">
                <ReactCountdownClock seconds={10} color={'#f64852'} alpha={0.9} size={50} onComplete={this.endRound} paused={this.state.pauseClock}/>
                <div id="right-margin">
                  <p className="no-margin">Round Points</p>
                  <h2 className="no-margin">{this.state.roundPoints}</h2>
                </div>
              </div>
              {
                this.state.roundStarted
                  ? <p id="controller-subhead">{this.state.currentClue.clue}</p>
                  : <p id="controller-subhead">{this.state.round}</p>
              }
              <p id="hang-tight">{this.state.roundName}</p>
              <p id="hang-tight-small">{this.state.roundDescription}</p>
              {
                this.state.roundStarted
                  ? <div>
                    <button onClick={this.correctAnswer} id="correct-answer-button">&#10004;</button>
                    <button onClick={this.passClue} id="wrong-answer-button">&#10007;</button>
                  </div>
                  : <button className="controller-submit" onClick={this.startRound}>start round!</button>
              }
            </div>
          </div>
          : <div id="playing-component">
            <div id="playing-container">
              <div id="controller-header">{this.state.name}</div>
              <p id="controller-subhead">{this.state.round}</p>
              <p id="hang-tight">Hang tight! We'll let you know when you're up next.</p>
            </div>
          </div>
    )
  }
}

export default Controller
