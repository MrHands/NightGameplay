import Names from './data/Names.json';

import DeckDatabase from './data/DeckDatabase.json';

class Player {
	constructor(id, name, logEvent) {
		this.id = id;
		this.name = name;
		this.logEvent = logEvent;
		this.leading = false;
		this.arousal = 0;
		this.maxArousal = 30;
		this.energy = 5;
		this.deck = [];
		this.hand = [];
	}

	shuffleCards(cards) {
		let copy = [];

		for (let n = cards.length; n > 0; n--) {
			let i = Math.floor(Math.random() * n);
			copy.push(cards.splice(i, 1)[0]);
		}

		return copy;
	}

	setupDeck(deckName) {
		let deckCards = this.shuffleCards(DeckDatabase.decks.find((deck) => deck.id === deckName).cards);

		this.deck = [];
		deckCards.forEach((card, index) => {
			this.deck.push({
				id: card,
				handId: index
			});
		});
	}

	endTurn() {
		// fill hand from deck

		this.hand = [];
		let indices = [];

		let cardList = this.deck.slice(0, 5);
		cardList.forEach(card => {
			this.logEvent(`Hand: Added ${card.id} to ${Names[this.id]}`);

			this.hand.push(card);

			indices.push(card.id);
		});

		this.deck = this.deck.filter(card => indices.indexOf(card.id) === -1);

		// reset energy

		this.energy = 5;
	}

	playCard(card, handId) {
		this.logEvent(`Playing: ${Names[this.id]} played ${card.id}`);

		if (this.energy < card.energy) {
			this.logEvent(`Not enough energy left to play card.`);

			return false;
		}

		this.energy -= card.energy;

		// remove from hand

		this.hand = this.hand.filter(c => c.handId !== Number(handId));

		return true;
	}
	
	applyEffects(effects, turn, streak) {
		for (const [key, effect] of Object.entries(effects.stats)) {
			let title = Names[key];

			if (turn === 'captain') {
				if (key === 'mine') {
					title = Names['captain'];
				} else if (key === 'theirs') {
					title = Names['crew'];
				}
			} else {
				if (key === 'mine') {
					title = Names['crew'];
				} else if (key === 'theirs') {
					title = Names['captain'];
				}
			}

			// console.log(`key ${key} value ${value} id ${this.id} turn ${turn}`);

			if (key === this.id || (key === 'mine' && turn === this.id) || (key === 'theirs' && turn !== this.id)) {
				let from = this.arousal;
				let delta = Math.sign(effect) * (Math.abs(effect) + streak);
				this.arousal = Math.max(0, this.arousal + delta);

				this.logEvent(`Effect: Added ${delta} to ${title}'s Arousal (${from} => ${this.arousal})`);
			}
		}
	}
};

export default Player;