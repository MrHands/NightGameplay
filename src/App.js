import React from 'react';

import Button from './components/Button';
import HowToPlay from './components/HowToPlay';
import Hud from './components/Hud';
import LogBook from './components/LogBook';
import Gameplay from './components/Gameplay';
import GameOver from './components/GameOver';
import PlayerBar from './components/PlayerBar';
import Player from './Player';

import CardsDatabase from './data/CardsDatabase.json';
import Names from './data/Names.json';

import './App.css';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			logBook: [],
			captain: new Player('captain', Names['captain'], this.logEvent),
			crew: new Player('crew', Names['crew'], this.logEvent),
			tableCardLeft: '',
			tableCardRight: '',
			tableCards: [],
			tablePrevious: '',
			discardPile: [],
			round: 0,
			winner: null,
			turn: 'captain',
			sexergy: 0,
			streak: 0,
		};

		// event handlers

		this.handlePlayCard = this.playCard.bind(this);
		this.handleNextTurn = this.nextTurn.bind(this);
		this.handleGameOver = this.gameOver.bind(this);
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

	getActiveEffectBlock(card, streak) {
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
		let {
			captain,
			crew
		} = this.state;

		this.logEvent(`New game started`);

		// set up players

		captain.arousal = 0;
		captain.setupDeck('captain');
		captain.endTurn();

		crew.arousal = 0;
		crew.setupDeck('crew');
		crew.endTurn();

		// round

		this.logEvent('ROUND 1');

		// start the game

		this.setState({
			round: 1,
			turn: 'captain',
			sexergy: 0,
			streak: 0,
			winner: null,
			captain: captain,
			crew: crew,
			tableCardLeft: '',
			tableCardRight: '',
			tableCards: [],
			tablePrevious: '',
			discardPile: [],
		});
	}

	playCard(event) {
		let {
			captain,
			crew,
			sexergy,
			streak,
			turn,
			tableCards,
			tableCardRight,
			tablePrevious,
		} = this.state;

		let cardId = event.target.getAttribute('card-id');
		let handId = Number(event.target.getAttribute('card-hand-id'));
		let cardPlayed = CardsDatabase.cards.find((c) => c.id === cardId);

		// check if card can be played

		if (turn === 'captain') {
			if (!captain.playCard(cardPlayed, handId)) {
				return;
			}
		} else {
			if (!crew.playCard(cardPlayed, handId)) {
				return;
			}
		}

		// apply card effects to players

		let cardEffects = this.getActiveEffectBlock(cardPlayed);

		this.logEvent(`Card: Applying ${cardId} to ${Names['captain']}`);
		captain.applyEffects(cardEffects, turn, streak);
		this.logEvent(`Card: Applying ${cardId} to ${Names['crew']}`);
		crew.applyEffects(cardEffects, turn, streak);

		// check if streak continues

		if (tablePrevious !== '') {
			let streakFrom = streak;

			let cardPrevious = CardsDatabase.cards.find((c) => c.id === tablePrevious);
			if (cardPrevious.connection === cardPlayed.type) {
				this.logEvent(`Connect: Previous connection ${cardPrevious.connection} matches new ${cardPlayed.type} card`);
	
				this.logEvent(`Streak: Continued (${streakFrom} => ${streak})`);
			} else {
				this.logEvent(`Connect: Previous connection ${cardPrevious.connection} does not match new ${cardPlayed.type} card`);
	
				streak = 0;
				this.logEvent(`Streak: Broken (${streakFrom} => ${streak})`);
			}

			// clear previous card from table and discard

			tableCards = [];
			this.discard(tablePrevious);
			tablePrevious = '';
		}

		// apply card effects to global state

		for (const [key, value] of Object.entries(cardEffects.stats)) {
			if (key === 'streak') {
				let from = streak;
				streak += value;

				this.logEvent(`Effect: Added ${value} to ${Names['streak']} (${from} => ${streak})`);
			} else if (key === 'sexergy') {
				// check for connection bonus

				let delta = value;

				if (tableCardRight) {
					let linked = CardsDatabase.cards.find((card) => card.id === tableCardRight);
					if (linked.connection === cardPlayed.type) {
						delta = value * 2;
					}
				}

				let from = sexergy;
				sexergy += delta;

				this.logEvent(`Effect: Added ${delta} to ${Names['sexergy']} (${from} => ${sexergy})`);
			}
		}

		// add to table

		tableCards.push(cardId);

		// update state

		this.setState({
			crew: crew,
			captain: captain,
			tableCardLeft: tableCardRight,
			tableCardRight: cardId,
			tableCards: tableCards,
			tablePrevious: tablePrevious,
			sexergy: sexergy,
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
		let {
			winner,
			captain,
			crew,
			tableCards,
			tableCardRight,
			round,
			turn,
			streak
		} = this.state;

		// add cards to discard pile

		tableCards.splice(0, tableCards.length - 1).forEach((card) => {
			this.discard(card);
		});

		// check win condition

		if (captain.arousal >= captain.maxArousal) {
			crew.energy = 100;
			captain.energy = 100;
			winner = captain;

			this.setState({
				captain: captain,
				crew: crew,
				winner: winner
			});

			return;
		} else if (crew.arousal >= crew.maxArousal) {
			crew.energy = 100;
			captain.energy = 100;
			winner = crew;

			this.setState({
				captain: captain,
				crew: crew,
				winner: winner
			});

			return;
		}

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
			tableCards: [ tableCardRight ],
			tablePrevious: tableCardRight,
			round: round,
			turn: turn,
			streak: streak,
		});
	}

	gameOver() {
		let {
			captain,
			crew,
			winner,
			turn
		} = this.state;

		if (turn === 'captain') {
			winner = captain;
		} else {
			winner = crew;
		}

		winner.arousal = winner.maxArousal;

		this.nextTurn();
	}

	render() {
		const {
			logBook,
			captain,
			crew,
			tableCardLeft,
			tableCardRight,
			tableCards,
			discardPile,
			round,
			winner,
			turn,
			sexergy,
			streak
		} = this.state;

		// game over

		if (winner) {
			return (
				<React.Fragment>
					<GameOver
						winner={winner}
						captain={captain}
						crew={crew}
						streak={streak}
						round={round}
						onResolve={this.handleGetActiveEffectBlock}
					/>
					<ul className="m-buttonBar">
						<Button onClick={this.handleStartNewGame}>
							Start new game
						</Button>
					</ul>
				</React.Fragment>
			);
		}

		// game start

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

		// gameplay

		let player = (turn === 'captain') ? captain : crew;

		let cardLink;
		if (tableCards.length > 0) {
			cardLink = tableCards.slice(-1)[0];
		}

		return (
			<React.Fragment>
				<Hud
					captain={captain}
					crew={crew}
					sexergy={sexergy}
					streak={streak}
				/>
				<Gameplay
					discardPile={discardPile}
					cardPrevious={tableCardLeft}
					cardNext={tableCardRight}
					tableCards={tableCards}
					cardLink={cardLink}
					turn={turn}
					streak={streak}
					onResolve={this.handleGetActiveEffectBlock}
				/>
				<PlayerBar
					player={player}
					turn={turn}
					streak={streak}
					cardLink={cardLink}
					onPlay={this.handlePlayCard}
					onResolve={this.handleGetActiveEffectBlock}
				/>
				<ul className="m-buttonBar">
					<Button onClick={this.handleNextTurn}>
						End turn
					</Button>
					<Button onClick={this.handleGameOver}>
						Game over
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
