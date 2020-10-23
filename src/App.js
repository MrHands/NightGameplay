import React from 'react';

import CardHand from './components/CardHand';
import EndTurn from './components/EndTurn';
import Hud from './components/Hud';
import GameState from './GameState';

import './App.css';

window.game = new GameState();
window.game.captain.hand = [ 'passionate-1', 'passionate-1', 'passionate-1', 'dominant-1', 'intimate-1' ];

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			turn: 'captain',
			streak: 1
		}

		this.handleNextTurn = this.nextTurn.bind(this);
	}

	nextTurn() {
		let newTurn;

		if (this.state.turn === 'captain') {
			newTurn = 'crew';
		} else {
			newTurn = 'captain';
		}

		this.setState({
			streak: this.state.streak + 1,
			turn: newTurn
		});
	}

	render() {
		return (
			<React.Fragment>
				<Hud captain={window.game.captain} crew={window.game.crew} streak={this.state.streak} />
				<CardHand owner={window.game.captain} turn={this.state.turn} />
				<EndTurn turn={this.state.turn} onClick={this.handleNextTurn} />
			</React.Fragment>
		);
	}
}

export default App;
