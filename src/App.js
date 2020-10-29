import React from 'react';

import Button from './components/Button';
import CardHand from './components/CardHand';
import HowToPlay from './components/HowToPlay';
import Hud from './components/Hud';
import LogBook from './components/LogBook';
import Table from './components/Table';
import Player from './Player';

import CardsDatabase from './data/CardsDatabase.json';
import Names from './data/Names.json';

import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			logBook: [],
			captain: new Player('captain', 'Captain', this.logEvent),
			crew: new Player('crew', 'Crew Member', this.logEvent),
			tableCardLeft: '',
			tableCardRight: '',
			round: 0,
			turn: 'captain',
			streak: 1,
		};

		// event handlers

		this.handlePlayCard = this.playCard.bind(this);
		this.handleNextTurn = this.nextTurn.bind(this);
		this.handleStartNewGame = this.startNewGame.bind(this);
		this.handleGetActiveEffectBlock = this.getActiveEffectBlock.bind(this);
	}

	logEvent = (event) => {
		let { logBook } = this.state;

		logBook.push(event);

		this.setState({
			logBook: logBook
		});
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

		this.logEvent(`New game started`);

		// set up decks

		captain.deck = this.shuffleCards(CardsDatabase.cards.map((card) => card.id));
		crew.deck = this.shuffleCards(CardsDatabase.cards.map((card) => card.id));

		// set up hands

		captain.fillHand();
		crew.fillHand();

		// round

		this.logEvent('ROUND 1');

		// play first card

		let firstCard = crew.hand[Math.floor(Math.random() * crew.hand.length)];
		crew.playCard(firstCard);

		this.setState({
			round: 1,
			turn: 'captain',
			streak: 1,
			captain: captain,
			crew: crew,
			tableCardLeft: firstCard
		});
	}

	playCard(event) {
		const { captain, crew, turn } = this.state;

		let id = event.target.getAttribute('card-id');

		if (turn === 'captain') {
			captain.playCard(id);

			this.setState({
				captain: captain,
				tableCardRight: id
			});
		} else {
			crew.playCard(id);

			this.setState({
				crew: crew,
				tableCardRight: id
			});
		}

		console.log(`turn ${turn} id ${id}`);
	}

	nextTurn() {
		let { captain, crew, tableCardLeft, tableCardRight, round, turn, streak } = this.state;

		// apply previous card effects

		let cardTableLeft = CardsDatabase.cards.find((card) => card.id === tableCardLeft);
		let effectsLeft = this.getActiveEffectBlock(cardTableLeft);
		this.logEvent(`Card: Applying ${tableCardLeft} to ${Names['captain']}`);
		captain.applyEffects(effectsLeft, turn, streak);
		this.logEvent(`Card: Applying ${tableCardLeft} to ${Names['crew']}`);
		crew.applyEffects(effectsLeft, turn, streak);

		// apply new card effects

		let cardTableRight = CardsDatabase.cards.find((card) => card.id === tableCardRight);
		let effectsRight = this.getActiveEffectBlock(cardTableRight);
		this.logEvent(`Card: Applying ${tableCardRight} to ${Names['captain']}`);
		captain.applyEffects(effectsRight, turn, streak);
		this.logEvent(`Card: Applying ${tableCardRight} to ${Names['crew']}`);
		crew.applyEffects(effectsRight, turn, streak);

		// apply card effects to streak

		for (const [key, value] of Object.entries(effectsLeft.stats)) {
			if (key === 'streak') {
				let from = streak;
				streak += value;

				this.logEvent(`Effect: Added ${value} to ${Names['streak']} (${from} => ${streak})`);
			}
		}

		for (const [key, value] of Object.entries(effectsRight.stats)) {
			if (key === 'streak') {
				let from = streak;
				streak += value;

				this.logEvent(`Effect: Added ${value} to ${Names['streak']} (${from} => ${streak})`);
			}
		}

		// check streak

		let streakFrom = streak;

		if (cardTableLeft.connection === cardTableRight.type) {
			this.logEvent(`Connect: Previous connection ${cardTableLeft.connection} matches new ${cardTableRight.type} card`);

			streak += 1;
			this.logEvent(`Streak: Continued (${streakFrom} => ${streak})`);
		} else {
			this.logEvent(`Connect: Previous connection ${cardTableLeft.connection} does not match new ${cardTableRight.type} card`);

			streak = 1;
			this.logEvent(`Streak: Broken (${streakFrom} => ${streak})`);
		}

		// change leading player

		this.logEvent(`Table: Removed ${tableCardLeft}`);

		if (turn === 'captain') {
			turn = 'crew';
		} else {
			turn = 'captain';
		}

		// fill hands

		captain.fillHand();
		crew.fillHand();

		// next round

		round += 1;
		this.logEvent(`ROUND ${round}`);

		this.setState({
			captain: captain,
			crew: crew,
			tableCardLeft: tableCardRight,
			tableCardRight: '',
			round: round,
			turn: turn,
			streak: streak,
		});
	}

	render() {
		const { logBook, captain, crew, tableCardLeft, tableCardRight, round, turn, streak } = this.state;

		if (round === 0) {
			return (
				<React.Fragment>
					<div className="o-explain">
						<HowToPlay />
					</div>
					<ul className="m-gameplay">
						<Button onClick={this.handleStartNewGame}>
							Start game
						</Button>
					</ul>
				</React.Fragment>
			);
		}

		let player = (turn === 'captain') ? captain : crew;

		return (
			<React.Fragment>
				<Hud captain={captain} crew={crew} streak={streak} />
				<h1>On the table</h1>
				<Table cardPrevious={tableCardLeft} cardNext={tableCardRight} turn={turn} streak={streak} onResolve={this.handleGetActiveEffectBlock} />
				<h1>{`${Names[turn]}'s hand`}</h1>
				<CardHand player={player} turn={turn} streak={streak} onPlay={this.handlePlayCard} onResolve={this.handleGetActiveEffectBlock} />
				<ul className="m-gameplay">
					<Button onClick={this.handleNextTurn}>
						End turn
					</Button>
				</ul>
				<div className="o-explain">
					<HowToPlay />
					<LogBook logBook={logBook} />
				</div>
			</React.Fragment>
		);
	}
}

export default App;
