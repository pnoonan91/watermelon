import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'
import firebase from '../firebase'
import history from './history'

class WaitingRoom extends Component {
  constructor() {
    super()

    this.state = {
      currentUser: '',
      currentGame: ''
    }
  }

  async componentDidMount() {
    this.setState({currentUser: this.props.match.params.userId})

    const playersRef = firebase.database().ref('players').child(`/${this.props.match.params.userId}`)
    await playersRef.once('value', (snapshot) => {
      let player = snapshot.val()
      this.setState({currentGame: player.gameId})
    })

    const gameRef = firebase.database().ref('games')
    gameRef.on('value', (snapshot) => {
      let games = snapshot.val()
      for (let game in games) {
        if (games[game].gameId === this.state.currentGame && games[game].status === 'playing') {
          history.push(`/player/${this.state.currentUser}`)
        }
      }
    })
  }

  componentWillUnmount() {
    this.setState({
      currentUser: '',
      currentGame: ''
    })
  }

  async startOver(e) {
    await firebase.database().ref('players').child(`/${e.target.value}`).remove()

    window.location.assign('http://localhost:3000/join')
  }

  render() {
    return (
      <div className="center-content tworem-padding waiting-room-component">
        <div id="waiting-container">
          <img src="/images/circle-watermelon-large.png" id="waiting-watermelon"/>
          <h1 id="waiting-text">Waiting for game to start.</h1>
          <div>
            <button onClick={this.startOver} id="start-over-sign-up" value={this.state.currentUser}>
              Start Over
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default WaitingRoom
