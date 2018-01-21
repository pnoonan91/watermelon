import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

class Rules extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src="/images/watermelon_logo.png" className="App-logo" alt="logo" />
          <h1 className="App-title no-margin">watermelon</h1>
        </header>
        <div id="landing-page-options">
          <div id="options-container">
            <h1 className="App-subtitle">Rules of the Game</h1>
            <div id="rules-container">
              <p>Watermelon is a hilarious word and memory game for groups of 4 or more.</p>
              <h2>Set Up</h2>
              <p><span className="bold">Gather your crew: </span> The game is to be played with a group of 4 or more people, consisting of an even amount of people in total.</p>
              <p><span className="bold">Set Up A Game: </span> Using a computer or TV with an internet browser, click on "Start a Game" from the homepage.</p>
              <p><span className="bold">Join A Game: </span> Each player joins the game from their individual phone, tablet, computer or other internet enabled device. Simply click "Join a Game" from the homepage and enter the Game Number associated with the game you'd like to join.</p>
              <p><span className="bold">Assign Teams: </span> Once everybody has joined the game, click on "Assign Teams" to assign everyone to their respective teams. Remember: teams should be made up of the same number of people to keep the scoring fair.</p>
              <h2>Game Play</h2>
              <p><span className="bold">Enter Your Clues: </span> Using a computer or TV with an internet browser, click on "Start a Game" from the homepage. This will propmpt each user to enter their clues to be used throughout the game. Clues must be people, places, things or simple phrases. The clues will be used in each of the 3 rounds of the game, as described in more detail below.</p>
              <p><span className="bold">Start the Game: </span> Once all players have entered their three clues, the active player will be prompted to start the round.</p>
              <p><span className="bold">Play the Game: </span> There are three rounds in Watermelon. For each round, players take turns tyring to get their teammates to guess the clue presented to them in accordance with the round rules, outlined below. The active player will have 1 minute to get their team to guess as many clues as possible.</p>
              <p><span className="bold">Scoring: </span> Correct answers are worth 10 points (awarded by clicking the green checkmark on the active player's screen). Passing is allowed, but discouraged. If you pass on a clue (clicking the red 'X' on the active player's screen) you must say outloud what the clue was and your team will be deducted -75 points.</p>
              <h3>Round 1 - Taboo</h3>
              <p>During round 1 - active players can say anything they'd like to get their teammates to guess the clue EXCEPT the word itself (or any variation of the word/rhymes with/starts with/etc... basically don't be a cheat).</p>
              <h3>Round 2 - Password</h3>
              <p>During round 2 - active players can only say ONE WORD to try to get their teammates to guess the clues. Remember that the clues from Round 1 will be the same clues used in Round 2 and Round 3. If the active player says more than one word they must wait for their turn to expire without giving any more clues.</p>
              <h3>Round 3 - Charades</h3>
              <p>During round 3 - active players may not say any words or make any noises. They can only abide by the rules of Charades to get their teammates to guess the clue at hand.</p>
              <h2>Ending the Game</h2>
              <p><span className="bold">The Winning Team: </span> Once all of the clues have been guessed in Round 3, the game will be over. The team with the most points at the end of Round 3 wins the game!</p>
              <p><span className="bold">Want to Play Again? </span> If you're feeling competitive and want to play again you can either choose the 'Rematch' option (which keeps the teams the same) or the 'New Game' option (which allows you to assign new teams with the same player group).</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Rules
