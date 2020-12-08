import React from 'react';

import Button from './components/Button';
import Card from './components/Card';
import CardHand from './components/CardHand';
import HowToPlay from './components/HowToPlay';
import Hud from './components/Hud';
import LogBook from './components/LogBook';
import Table from './components/Table';
import Player from './Player';

import CardsDatabase from './data/CardsDatabase.json';
import DeckDatabase from './data/DeckDatabase.json';
import Names from './data/Names.json';

import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			logBook: [],
			captain: new Player('captain', Names['captain'], this.logEvent),
			crew: new Player('crew', Names['crew'], this.logEvent),
			cardLink: '',
			tableCardLeft: '',
			tableCardRight: '',
			tableCards: [],
			discardPile: [],
			round: 0,
			turn: 'captain',
			streak: 0,
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

		// set up players

		captain.deck = this.shuffleCards(DeckDatabase.decks.find((deck) => deck.id === 'captain').cards);
		captain.endTurn();

		crew.deck = this.shuffleCards(DeckDatabase.decks.find((deck) => deck.id === 'crew').cards);
		crew.endTurn();

		// round

		this.logEvent('ROUND 1');

		// crew member starts

		this.setState({
			round: 1,
			turn: 'crew',
			streak: 0,
			captain: captain,
			crew: crew
		});
	}

	playCard(event) {
		let { captain, crew, streak, turn, tableCards, cardLink } = this.state;

		let cardId = event.target.getAttribute('card-id');
		let cardPlayed = CardsDatabase.cards.find((c) => c.id === cardId);

		// check if card can be played

		if (turn === 'captain') {
			if (!captain.playCard(cardPlayed)) {
				return;
			}
		} else {
			if (!crew.playCard(cardPlayed)) {
				return;
			}
		}

		let cardEffects = this.getActiveEffectBlock(cardPlayed);

		// check if streak continues

		if (cardLink !== '') {
			let streakFrom = streak;

			let cardPrevious = CardsDatabase.cards.find((c) => c.id === cardLink);
			if (cardPrevious.connection === cardPlayed.type) {
				this.logEvent(`Connect: Previous connection ${cardPrevious.connection} matches new ${cardPlayed.type} card`);
	
				this.logEvent(`Streak: Continued (${streakFrom} => ${streak})`);
			} else {
				this.logEvent(`Connect: Previous connection ${cardPrevious.connection} does not match new ${cardPlayed.type} card`);
	
				streak = 0;
				this.logEvent(`Streak: Broken (${streakFrom} => ${streak})`);
			}
		}

		// apply card effects to players

		this.logEvent(`Card: Applying ${cardId} to ${Names['captain']}`);
		captain.applyEffects(cardEffects, turn, streak);
		this.logEvent(`Card: Applying ${cardId} to ${Names['crew']}`);
		crew.applyEffects(cardEffects, turn, streak);

		// apply card effects to streak

		for (const [key, value] of Object.entries(cardEffects.stats)) {
			if (key === 'streak') {
				let from = streak;
				streak += value;

				this.logEvent(`Effect: Added ${value} to ${Names['streak']} (${from} => ${streak})`);
			}
		}

		// add to table

		tableCards.push(cardId);

		// update state

		this.setState({
			crew: crew,
			captain: captain,
			tableCardRight: cardId,
			tableCards: tableCards,
			cardLink: '',
			streak: streak
		});
	}

	discard(cardId) {
		let { discardPile } = this.state;

		discardPile.push(cardId);

		this.logEvent(`Table: Added ${cardId} to the discard pile`);

		this.setState({
			discardPile: discardPile
		});
	}

	nextTurn() {
		let { captain, crew, tableCardLeft, tableCards, tableCardRight, round, turn, streak } = this.state;

		// add cards to discard pile

		if (tableCardLeft !== '') {
			this.discard(tableCardLeft);
		}

		tableCards.splice(0, tableCards.length - 1).forEach((card) => {
			this.discard(card);
		});

		// change leading player

		if (turn === 'captain') {
			turn = 'crew';
		} else {
			turn = 'captain';
		}

		// end player turn

		captain.endTurn();
		crew.endTurn();

		// next round

		round += 1;
		this.logEvent(`ROUND ${round}`);

		this.setState({
			captain: captain,
			crew: crew,
			tableCardLeft: tableCardRight,
			tableCardRight: '',
			tableCards: [],
			cardLink: tableCardRight,
			round: round,
			turn: turn,
			streak: streak,
		});
	}

	render() {
		const {
			logBook,
			captain,
			crew,
			tableCardLeft,
			tableCardRight,
			tableCards,
			cardLink,
			discardPile,
			round,
			turn,
			streak
		} = this.state;

		if (round === 0) {
			return (
				<React.Fragment>
					<div className="o-explain">
						<HowToPlay />
					</div>
					<ul className="m-buttonBar">
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
				<section className="o-gameplay">
					<div>
						<h1>Discard pile</h1>
						<ul className="m-discardPile">
							{discardPile.reverse().map((card, index) => {
								return (<Card id={card} key={`discarded-${index}`} isDiscarded={true} />);
							})}
						</ul>
					</div>
					<div>
						<h1>On the table</h1>
						<Table cardPrevious={tableCardLeft} cardNext={tableCardRight} tableCards={tableCards} cardLink={cardLink} turn={turn} streak={streak} onResolve={this.handleGetActiveEffectBlock} />
					</div>
				</section>
				<h1>{`${Names[turn]}'s turn`}</h1>
				<CardHand player={player} turn={turn} streak={streak} onPlay={this.handlePlayCard} cardLink={cardLink} onResolve={this.handleGetActiveEffectBlock} />
				<h2>{`Energy Remaining: ${player.energy}`}</h2>
				<ul className="m-buttonBar">
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
