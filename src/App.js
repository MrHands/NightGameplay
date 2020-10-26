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
			tableCardCaptain: '',
			tableCardCrew: '',
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

		// event handlers

		this.handlePlayCard = this.playCard.bind(this);
		this.handleNextTurn = this.nextTurn.bind(this);
	}

	playCard(event) {
		const { turn } = this.state;

		let id = event.target.getAttribute('card-id');

		if (turn === 'captain') {
			this.setState({
				tableCardCaptain: id
			});
		} else {
			this.setState({
				tableCardCrew: id
			});
		}

		console.log(`turn ${turn} id ${id}`);
	}

	nextTurn() {
		const { turn } = this.state;
		let newTurn;

		if (turn === 'captain') {
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
		const { captain, crew, tableCardCaptain, tableCardCrew, turn, streak } = this.state;

		console.log(`tableCardCaptain ${tableCardCaptain} tableCardCrew ${tableCardCrew}`);

		return (
			<React.Fragment>
				<Hud captain={captain} crew={crew} streak={streak} />
				<Table cardCaptain={tableCardCaptain} cardCrew={tableCardCrew} turn={turn} streak={streak} />
				<CardHand owner={captain} turn={turn} streak={streak} onPlay={this.handlePlayCard} />
				<EndTurn turn={turn} onClick={this.handleNextTurn} />
			</React.Fragment>
		);
	}
}

export default App;
