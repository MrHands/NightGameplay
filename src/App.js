import React from 'react';

import Button from './components/Button';
import CardHand from './components/CardHand';
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
			round: 1,
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
		const { logBook, captain, crew, tableCardLeft, tableCardRight, turn, streak } = this.state;

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
					<Button onClick={this.handleStartNewGame}>
						New game
					</Button>
				</ul>
				<div className="o-explain">
					<div className="m-howToPlay">
						<h2>What is this?</h2>
						<p>This is a prototype for the night gameplay in Up There They Love, made using React.</p> 
						<p>You play as the Captain and you are looking have a good time with your Crew Member. Your goal is to fill the Crew Member's Arousal bar at the top of the screen. At the same time, they're trying to fill yours. The best outcome is for both bars to be filled at the same time.</p>
						<p>You can affect the bars by playing a card from your hand against the one on the table. Cards can affect both of your Arousal bars.</p>
						<p>Note that you always play two cards at the end of each round: the one that was on the table previously and the one that was just put down.</p>
						<p>If the connection type from the previous card matches the type of your card, you will increase the streak. The higher the streak, the more points you will earn for each card being played.</p>
						<h2>How to play</h2>
						<ul>
							<li>Press "New game" to start playing</li>
							<li>Click on a card from your hand to place it on the table</li>
							<li>Press "End Turn" to end your turn and apply the card to the game</li>
							<li>Select a card that the Crew Member will play</li>
							<li>Keep playing until the bars fill up</li>
						</ul>
					</div>
					<LogBook logBook={logBook} />
				</div>
			</React.Fragment>
		);
	}
}

export default App;
