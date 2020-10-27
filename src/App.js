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

		// event handlers

		this.handlePlayCard = this.playCard.bind(this);
		this.handleNextTurn = this.nextTurn.bind(this);
		this.handleResolveRound = this.resolveRound.bind(this);
		this.handleStartNewGame = this.startNewGame.bind(this);
	}

	getActiveEffectBlock(card) {
		let { streak } = this.state;

		let defaultBlock = card.effects.find((effect) => {
			return !effect.condition;
		});

		let block = defaultBlock;

		let conditionalBlock = card.effects.find((effect) => {
			return effect.condition;
		});
		if (conditionalBlock) {
			let { check, value } = conditionalBlock.condition;

			let valid = false;
			if (check === 'equal') {
				valid = streak === value;
			} else if (check === 'greater-than') {
				valid = streak > value;
			} else if (check === 'greater-than-equal') {
				valid = streak >= value;
			}  else if (check === 'less-than') {
				valid = streak < value;
			} else if (check === 'less-than-equal') {
				valid = streak <= value;
			}

			if (valid) {
				block = conditionalBlock;
			}
		}

		return block;
	}

	startNewGame() {
		let { captain, crew } = this.state;

		// set up decks

		captain.deck = CardsDatabase.cards.map((card) => card.id);
		crew.deck = CardsDatabase.cards.map((card) => card.id);

		// set up hands

		captain.hand = captain.deck.sort(() => Math.random() - 0.5).slice(0, 5);
		crew.hand = captain.deck.sort(() => Math.random() - 0.5).slice(0, 5);

		// play first card

		let firstCard = crew.hand[Math.floor(Math.random() * crew.hand.length)];
		crew.hand = crew.hand.filter(c => c !== firstCard);

		this.setState({
			streak: 1,
			turn: 'captain',
			captain: captain,
			crew: crew,
			tableCardCrew: firstCard
		});
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
		const { captain, crew, tableCardCaptain, tableCardCrew, turn, streak } = this.state;

		let cardTableCaptain = CardsDatabase.cards.find((card) => card.id === tableCardCaptain);
		let cardTableCrew = CardsDatabase.cards.find((card) => card.id === tableCardCrew);

		captain.applyCard(cardTableCaptain, turn, streak);
		crew.applyCard(cardTableCrew, turn, streak);

		this.setState({
			captain: captain,
			crew: crew,
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
				<ul className="m-gameplay">
					<Button onClick={this.handleNextTurn}>
						End turn
					</Button>
					<Button onClick={this.handleResolveRound}>
						Resolve round
					</Button>
					<Button onClick={this.handleStartNewGame}>
						New game
					</Button>
				</ul>
			</React.Fragment>
		);
	}
}

export default App;
