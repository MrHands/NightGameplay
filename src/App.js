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
			lead: 'captain'
		}

		this.handleNextTurn = this.nextTurn.bind(this);
	}

	nextTurn() {
		let newLead;

		if (this.state.lead === 'captain') {
			newLead = 'crew';
		} else {
			newLead = 'captain';
		}

		this.setState({
			lead: newLead
		});
	}

	render() {
		return (
			<React.Fragment>
				<Hud game={window.game} />
				<CardHand owner={window.game.captain} />
				<EndTurn turn={this.state.lead} onClick={this.handleNextTurn} />
			</React.Fragment>
		);
	}
}

export default App;
