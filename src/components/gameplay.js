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
      activePlayer: '',
      clues: [],
      round: '',
      teamA: [],
      teamB: [],
      teamAPoints: 0,
      teamBPoints: 0
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
      let newGameId
      let newRound
      for (let game in games) {
        if (games[game].gameId === this.props.match.params.currentGame) {
          newGameId = game
          newRound = games[game].round
        }
      }
      this.setState({gameId: newGameId, round: newRound})
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
    clueRef.on('value', (snapshot) => {
      let clues = snapshot.val()
      for (let clue in clues) {
        console.log(clues[clue].gameId === this.props.match.params.currentGame)
        if (clues[clue].gameId === this.props.match.params.currentGame) {
          this.setState({clues: this.state.clues.concat({id: clue, clue: clues[clue].clue})})
        }
      }
      if (this.state.clues.length === (this.state.players.length)*3) {
        this.setState({activePlayer: this.state.playersSorted[0]})
      }
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

  render() {
    return (
      <div id="gameplay-component">
        <div id="gameplay-container">
          {
            this.state.activePlayer.name
              ? <div>
                <div id="gameplay-header">{this.state.round}</div>
                <p id="gameplay-subhead">{this.state.activePlayer.name} is up!</p>
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
