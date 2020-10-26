import React from 'react';

import Button from './components/Button';
import CardHand from './components/CardHand';
import Hud from './components/Hud';
import Table from './components/Table';
import Player from './Player';

import CardsDatabase from './data/CardsDatabase.json';
import Names from './data/Names.json';

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
		this.handleResolveRound = this.resolveRound.bind(this);
	}

	playCard(event) {
		const { turn } = this.state;

		let id = event.target.getAttribute('card-id');

		if (turn === 'captain') {
			let player = this.state.captain;
			player.hand = player.hand.filter(c => c !== id);

			this.setState({
				captain: player,
				tableCardCaptain: id
			});
		} else {
			let player = this.state.crew;
			player.hand = player.hand.filter(c => c !== id);

			this.setState({
				crew: player,
				tableCardCrew: id
			});
		}

		console.log(`turn ${turn} id ${id}`);
	}

	nextTurn() {
		const { turn } = this.state;

		if (turn === 'captain') {
			this.setState({
				turn: 'crew'
			});
		} else {
			this.setState({
				turn: 'captain'
			});
		}
	}

	resolveRound() {
		const { streak } = this.state;

		this.setState({
			tableCardCaptain: '',
			tableCardCrew: '',
			streak: streak + 1,
		});
	}

	render() {
		const { captain, crew, tableCardCaptain, tableCardCrew, turn, streak } = this.state;

		console.log(`tableCardCaptain ${tableCardCaptain} tableCardCrew ${tableCardCrew}`);

		let hand = (turn === 'captain') ? captain : crew;

		return (
			<React.Fragment>
				<Hud captain={captain} crew={crew} streak={streak} />
				<Table cardCaptain={tableCardCaptain} cardCrew={tableCardCrew} turn={turn} streak={streak} />
				<h1>{`${Names[turn]}'s turn`}</h1>
				<CardHand owner={hand} turn={turn} streak={streak} onPlay={this.handlePlayCard} />
				<Button onClick={this.handleNextTurn}>
					End turn
				</Button>
				<Button onClick={this.handleResolveRound}>
					Resolve round
				</Button>
			</React.Fragment>
		);
	}
}

export default App;
