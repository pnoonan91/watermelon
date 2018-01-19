import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import firebase from '../firebase'

class Controller extends Component {
  constructor() {
    super()

    this.state = {
      name: '',
      playerId: '',
      active: false,
      gameId: '',
      round: '',
      enterClues: true
    }

    this.enterClues = this.enterClues.bind(this)
  }

  async componentDidMount() {
    this.setState({playerId: this.props.match.params.userId})

    const playersRef = firebase.database().ref('players').child(`/${this.props.match.params.userId}`)
    await playersRef.once('value', (snapshot) => {
      let player = snapshot.val()
      this.setState({gameId: player.gameId, name: player.name})
    })

    const gameRef = firebase.database().ref('games')
    gameRef.on('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === this.state.gameId) {
          this.setState({round: games[game].round})
        }
      }
    })
  }

  enterClues(e) {
    e.preventDefault()
    let clueArr = [e.target.one.value, e.target.two.value, e.target.three.value]

    const clueRef = firebase.database().ref('clues')
    clueArr.forEach(clue => {
      clueRef.push({clue: clue, gameId: this.state.gameId})
    })

    this.setState({enterClues: false})
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
          ? <h1>You're Up!</h1>
          : <div id="playing-component">
            <div id="playing-container">
              <div id="controller-header">{this.state.name}</div>
              <p id="controller-subhead">{this.state.round}</p>
              <p id="hang-tight">Hang tight! We'll let you know when you're up.</p>
            </div>
          </div>
    )
  }
}

export default Controller
