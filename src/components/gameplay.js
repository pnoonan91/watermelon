import React, { Component } from 'react'
import '../App.css'
import firebase from '../firebase.js'

class GamePlay extends Component {
  constructor() {
    super()

    this.state = {
      currentGame: '',
      players: [],
      playersSorted: [],
      status: '',
      activePlayer: {},
      clues: []
    }

    this.merge = this.merge.bind(this)
  }

  async componentDidMount() {
    this.setState({
      currentGame: this.props.match.params.currentGame
    })

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

    this.setState({playersSorted: this.merge(teamA, teamB)})

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

  render() {
    return (
      <div>
        <h1>Game Play Time!</h1>
      </div>
    )
  }
}

export default GamePlay
