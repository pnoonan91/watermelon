import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

class Teams extends Component {
  constructor() {
    super()

    this.state = {
      currentGame: '',
      players: [],
      status: 'waiting'
    }
  }

  componentDidMount() {
    this.setState({
      currentGame: this.props.match.params.currentGame
    })
  }

  render() {
    return (
      <h1>Teams Component!</h1>
    )
  }
}

export default Teams
