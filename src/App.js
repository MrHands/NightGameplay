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
		this.handleStartNewGame = this.startNewGame.bind(this);
		this.handleGetActiveEffectBlock = this.getActiveEffectBlock.bind(this);
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

	shuffleCards(cards) {
		let copy = [];

		for (let n = cards.length; n > 0; n--) {
			let i = Math.floor(Math.random() * n);
			copy.push(cards.splice(i, 1)[0]);
		}

		return copy;
	}

	startNewGame() {
		let { captain, crew } = this.state;

		// set up decks

		let allCards = CardsDatabase.cards.map((card) => card.id);
		captain.deck = this.shuffleCards(allCards);
		crew.deck = this.shuffleCards(allCards);

		// set up hands

		captain.hand = captain.deck.slice(0, 5);
		crew.hand = captain.deck.slice(0, 5);

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
		let { captain, crew, tableCardCaptain, tableCardCrew, turn, streak } = this.state;

		// apply captain card effects

		let cardTableCaptain = CardsDatabase.cards.find((card) => card.id === tableCardCaptain);
		let captainEffects = this.getActiveEffectBlock(cardTableCaptain);
		captain.applyEffects(captainEffects, turn, streak);
		crew.applyEffects(captainEffects, turn, streak);

		// apply crew member card effects

		let cardTableCrew = CardsDatabase.cards.find((card) => card.id === tableCardCrew);
		let crewEffects = this.getActiveEffectBlock(cardTableCrew);
		crew.applyEffects(crewEffects, turn, streak);
		captain.applyEffects(crewEffects, turn, streak);

		// apply card effects to streak

		for (const [key, value] of Object.entries(captainEffects.stats)) {
			if (key === 'streak') {
				streak += value;
			}
		}

		for (const [key, value] of Object.entries(crewEffects.stats)) {
			if (key === 'streak') {
				streak += value;
			}
		}

		// change turns

		if (turn === 'captain') {
			tableCardCrew = '';
			turn = 'crew';
		} else {
			tableCardCaptain = '';
			turn = 'captain';
		}

		this.setState({
			captain: captain,
			crew: crew,
			tableCardCaptain: tableCardCaptain,
			tableCardCrew: tableCardCrew,
			turn: turn,
			streak: streak + 1,
		});
	}

	render() {
		const { captain, crew, tableCardCaptain, tableCardCrew, turn, streak } = this.state;

		console.log(`tableCardCaptain ${tableCardCaptain} tableCardCrew ${tableCardCrew}`);

		let player = (turn === 'captain') ? captain : crew;

		return (
			<React.Fragment>
				<Hud captain={captain} crew={crew} streak={streak} />
				<Table cardCaptain={tableCardCaptain} cardCrew={tableCardCrew} turn={turn} streak={streak} onResolve={this.handleGetActiveEffectBlock} />
				<h1>{`${Names[turn]}'s turn`}</h1>
				<CardHand player={player} turn={turn} streak={streak} onPlay={this.handlePlayCard} onResolve={this.handleGetActiveEffectBlock} />
				<ul className="m-gameplay">
					<Button onClick={this.handleNextTurn}>
						End turn
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
