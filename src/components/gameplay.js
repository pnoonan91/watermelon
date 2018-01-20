import React, { Component } from 'react'
import '../App.css'
import firebase from '../firebase.js'
import history from './history'

class GamePlay extends Component {
  constructor() {
    super()

    this.state = {
      currentGame: '',
      players: [],
      playersSorted: [],
      playerIndex: 0,
      status: '',
      activePlayer: '',
      clues: [],
      round: '',
      teamA: [],
      teamB: [],
      teamAPoints: 0,
      teamBPoints: 0,
      roundName: '',
      roundDescription: '',
      initiateFirstPlayer: true
    }

    this.merge = this.merge.bind(this)
    this.nextPlayer = this.nextPlayer.bind(this)
    this.incrementPlayerIndex = this.incrementPlayerIndex.bind(this)
  }

  async componentDidMount() {
    this.setState({
      currentGame: this.props.match.params.currentGame
    })

    const gameRef = firebase.database().ref('games')
    await gameRef.once('value', (snapshot) => {
      let games = snapshot.val()
      let newGameId
      let newRound
      let roundName
      let roundDescription
      for (let game in games) {
        if (games[game].gameId === this.props.match.params.currentGame) {
          newGameId = game
          newRound = games[game].round
          roundName = games[game].roundName
          roundDescription = games[game].roundDescription
        }
      }
      this.setState({gameId: newGameId, round: newRound, roundName: roundName, roundDescription: roundDescription})
    })

    gameRef.child(`/${this.state.gameId}`).on('value', (snapshot) => {
      let newRound = snapshot.val()
      if (newRound.round !== this.state.round) {
        this.setState({
          round: newRound.round,
          roundName: newRound.roundName,
          roundDescription: newRound.roundDescription
        })
      }
    })

    const playersRef = firebase.database().ref('players')
    await playersRef.once('value', (snapshot) => {
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

    let teamA = this.state.players.filter(player => player.team === 'A')
    let teamB = this.state.players.filter(player => player.team === 'B')

    this.setState({playersSorted: this.merge(teamA, teamB), teamA: teamA, teamB: teamB})

    const clueRef = firebase.database().ref('clues')
    await clueRef.on('value', (snapshot) => {
      let clues = snapshot.val()

      for (let clue in clues) {
        if (clues[clue].gameId === this.props.match.params.currentGame) {
          let addToClues = true
          for (var i = 0; i<this.state.clues.length; i++) {
            console.log('entered for loop')
            if (this.state.clues[i].id === clue) {
              addToClues = false
            }
          }
          if (addToClues) {
            this.setState({clues: this.state.clues.concat({id: clue, clue: clues[clue].clue})})
          }
        }
      }
      if (this.state.clues.length === (this.state.players.length)*3 && this.state.initiateFirstPlayer === true) {
        this.setState({activePlayer: this.state.playersSorted[this.state.playerIndex], initiateFirstPlayer: false})
        firebase.database().ref('games').child(`/${this.state.gameId}`).update({activePlayer: this.state.activePlayer.name})

        this.incrementPlayerIndex()

        firebase.database().ref('players').child(`/${this.state.activePlayer.id}`).update({activePlayer: true})
      }
    })

    gameRef.child(`/${this.state.gameId}`).on('value', (snapshot) => {
      let newScore = snapshot.val()
      console.log('newScore: ', newScore)
      if (newScore.teamAScore !== this.state.teamAPoints || newScore.teamBScore !== this.state.teamBPoints) {
        this.setState({
          teamAPoints: newScore.teamAScore,
          teamBPoints: newScore.teamBScore
        })
      }
      if (newScore.activePlayer !== this.state.activePlayer.name && this.state.activePlayer !== '') {
        this.nextPlayer()
      }
      if (newScore.status === 'complete') {
        history.push(`/gameover/${this.props.match.params.currentGame}`)
      }
    })
  }

  componentWillUnmount() {
    this.setState({
      activePlayer: '',
      clues: []
    })
  }

  merge(arr1, arr2) {
    let aTeam = true
    let arr1index = 0
    let arr2index = 0
    let returnArr = []

    while (arr1index < arr1.length || arr2index < arr2.length) {
      if (aTeam) {
        if (arr1[arr1index] !== undefined) {
          returnArr.push(arr1[arr1index])
        }
        aTeam = false
        arr1index++
      } else {
        if (arr2[arr2index] !== undefined) {
          returnArr.push(arr2[arr2index])
        }
        aTeam = true
        arr2index++
      }
    }

    return returnArr
  }

  incrementPlayerIndex() {
    if (this.state.playerIndex+1 < this.state.playersSorted.length) {
      this.setState({playerIndex: this.state.playerIndex+1})
    } else {
      this.setState({playerIndex: 0})
    }
  }

  async nextPlayer() {
    console.log('nextPlayer function hit')
    await this.setState({
      activePlayer: this.state.playersSorted[this.state.playerIndex]
    })
    await firebase.database().ref('games').child(`/${this.state.gameId}`).update({activePlayer: this.state.activePlayer.name})
    this.incrementPlayerIndex()
    firebase.database().ref('players').child(`/${this.state.activePlayer.id}`).update({activePlayer: true})
  }

  render() {
    return (
      <div id="gameplay-component">
        <div id="gameplay-container">
          {
            this.state.activePlayer.name
              ? <div>
                <div id="gameplay-header">{this.state.round}</div>
                <p id="gameplay-subhead">{this.state.activePlayer.name} is up!</p>
                <h1>{this.state.roundName}</h1>
                <p>{this.state.roundDescription}</p>
                <div id="team-container">
                  <div>
                    <h1 className="team-header">TEAM A</h1>
                    <h1>{this.state.teamAPoints} Points</h1>
                    {
                      this.state.teamA.map(player => (
                        '- '+player.name
                      ))
                    } -
                  </div>
                  <div id="gameplay-divider" />
                  <div>
                    <h1 className="team-header">TEAM B</h1>
                    <h1>{this.state.teamBPoints} Points</h1>
                    {
                      this.state.teamB.map(player => (
                        ' - '+player.name
                      ))
                    } -
                  </div>
                </div>
              </div>
              : <div>
                <img src="/images/circle-watermelon-large.png" id="clue-watermelon"/>
                <h1 id="clue-header">Time to enter those clues!</h1>
                <p className="large-font" id="clue-text">Follow the prompts on your phone to enter your clues! Remember- clues should be: people, places, things or short/simple phrases that everybody knows.</p>
              </div>
          }


        </div>
      </div>
    )
  }
}

export default GamePlay
