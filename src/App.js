import React from 'react';

import CardHand from './components/CardHand';
import EndTurn from './components/EndTurn';
import Hud from './components/Hud';
import Table from './components/Table';
import Player from './Player';

import CardsDatabase from './data/CardsDatabase.json';

import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			captain: new Player('captain', 'Captain'),
			crew: new Player('crew', 'Crew Member'),
			table: {
				captain: '',
				crew: '',
			},
			turn: 'captain',
			streak: 1
		};

		let { captain, crew } = this.state;

		// set up decks

		captain.deck = CardsDatabase.cards.map((card) => card.id);
		crew.deck = CardsDatabase.cards.map((card) => card.id);

		// set up hands

		captain.hand = captain.deck.sort(() => Math.random() - 0.5).slice(0, 5);
		crew.hand = captain.deck.sort(() => Math.random() - 0.5).slice(0, 5);

		// handle next turn

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
		const { captain, crew, table, turn, streak } = this.state;

		return (
			<React.Fragment>
				<Hud captain={captain} crew={crew} streak={streak} />
				<Table table={table} turn={turn} streak={streak} />
				<CardHand owner={captain} turn={turn} streak={streak} />
				<EndTurn turn={turn} onClick={this.handleNextTurn} />
			</React.Fragment>
		);
	}
}

export default App;
