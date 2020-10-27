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
			tableCardCaptain: '',
			tableCardCrew: '',
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
			tableCardCrew: firstCard
		});
	}

	playCard(event) {
		const { captain, crew, turn } = this.state;

		let id = event.target.getAttribute('card-id');

		if (turn === 'captain') {
			captain.playCard(id);

			this.setState({
				captain: captain,
				tableCardCaptain: id
			});
		} else {
			crew.playCard(id);

			this.setState({
				crew: crew,
				tableCardCrew: id
			});
		}

		console.log(`turn ${turn} id ${id}`);
	}

	nextTurn() {
		let { captain, crew, tableCardCaptain, tableCardCrew, round, turn, streak } = this.state;

		// apply captain card effects

		let cardTableCaptain = CardsDatabase.cards.find((card) => card.id === tableCardCaptain);
		let captainEffects = this.getActiveEffectBlock(cardTableCaptain);
		this.logEvent(`Card: Applying ${tableCardCaptain} to ${Names['captain']}`);
		captain.applyEffects(captainEffects, turn, streak);
		this.logEvent(`Card: Applying ${tableCardCaptain} to ${Names['crew']}`);
		crew.applyEffects(captainEffects, turn, streak);

		// apply crew member card effects

		let cardTableCrew = CardsDatabase.cards.find((card) => card.id === tableCardCrew);
		let crewEffects = this.getActiveEffectBlock(cardTableCrew);
		this.logEvent(`Card: Applying ${tableCardCrew} to ${Names['captain']}`);
		captain.applyEffects(crewEffects, turn, streak);
		this.logEvent(`Card: Applying ${tableCardCrew} to ${Names['crew']}`);
		crew.applyEffects(crewEffects, turn, streak);

		// apply card effects to streak

		for (const [key, value] of Object.entries(captainEffects.stats)) {
			if (key === 'streak') {
				let from = streak;
				streak += value;

				this.logEvent(`Effect: Added ${value} to ${Names['streak']} (${from} => ${streak})`);
			}
		}

		for (const [key, value] of Object.entries(crewEffects.stats)) {
			if (key === 'streak') {
				let from = streak;
				streak += value;

				this.logEvent(`Effect: Added ${value} to ${Names['streak']} (${from} => ${streak})`);
			}
		}

		// check streak

		let streakFrom = streak;

		if (turn === 'captain') {
			if (cardTableCrew.connection === cardTableCaptain.type) {
				this.logEvent(`Connect: ${Names['crew']}'s ${cardTableCrew.connection} connection matches ${Names['captain']}'s ${cardTableCaptain.type} card`);

				streak += 1;
				this.logEvent(`Streak: Continued (${streakFrom} => ${streak})`);
			} else {
				this.logEvent(`Connect: ${Names['crew']}'s ${cardTableCrew.connection} connection does not match ${Names['captain']}'s ${cardTableCaptain.type} card`);

				streak = 1;
				this.logEvent(`Streak: Broken (${streakFrom} => ${streak})`);
			}
		} else {
			if (cardTableCaptain.connection === cardTableCrew.type) {
				this.logEvent(`Connect: ${Names['captain']}'s ${cardTableCaptain.connection} connection matches ${Names['crew']}'s ${cardTableCrew.type} card`);

				streak += 1;
				this.logEvent(`Streak: Continued (${streakFrom} => ${streak})`);
			} else {
				this.logEvent(`Connect: ${Names['captain']}'s ${cardTableCaptain.connection} connection does not match ${Names['crew']}'s ${cardTableCrew.type} card`);

				streak = 1;
				this.logEvent(`Streak: Broken (${streakFrom} => ${streak})`);
			}
		}

		// change turns

		if (turn === 'captain') {
			this.logEvent(`Table: Removed ${Names['crew']}'s ${tableCardCrew}`);

			tableCardCrew = '';
			turn = 'crew';
		} else {
			this.logEvent(`Table: Removed ${Names['captain']}'s ${tableCardCaptain}`);

			tableCardCaptain = '';
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
			tableCardCaptain: tableCardCaptain,
			tableCardCrew: tableCardCrew,
			round: round,
			turn: turn,
			streak: streak,
		});
	}

	render() {
		const { logBook, captain, crew, tableCardCaptain, tableCardCrew, turn, streak } = this.state;

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
				<div className="o-explain">
					<div className="m-howToPlay">
						<h2>What is this?</h2>
						<p>This is a prototype for the night gameplay in Up There They Love. You play as the Captain and you want to have a good time with your Crew Member.</p>
						<p>Your goal is to fill the Crew Member's Arousal bar at the top of the screen. You do this by playing a card from your hand against the one on the table. Cards can affect both of your Arousal bars.</p>
						<p>If the connection type from the previous card matches the type of your card, you will increase the streak. The higher the streak, the more points you will earn for each card played.</p>
						<h2>How to play</h2>
						<ul>
							<li>Press "New game" to start playing</li>
							<li>Select a card from your hand to place on the table</li>
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
