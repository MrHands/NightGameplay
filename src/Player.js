import Names from './data/Names.json';

import DeckDatabase from './data/DeckDatabase.json';

class Player {
	constructor(id, name, logEvent) {
		this.id = id;
		this.name = name;
		this.logEvent = logEvent;
		this.leading = false;
		this.maxArousal = 30;
		this.arousal = 0;
		this.maxEnergy = 5;
		this.energy = this.maxEnergy;
		this.deckName = null;
		this.deckCards = [];
		this.hand = [];
		this.discarded = [];
		this.played = [];
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
		this.deckName = deckName;

		let deck = DeckDatabase.decks.find((deck) => deck.id === deckName);
		let deckCards = this.shuffleCards([...deck.cards]);

		this.deckCards = deckCards.map((card, index) => {
			return {
				id: card,
				handId: index
			};
		});
	}

	endTurn() {
		// discard cards from hand

		this.hand.forEach(card => {
			this.discarded.push(card);
		});

		this.hand = [];

		// check if deck has enough cards

		console.log(`${this.id} ${this.deckCards.length}`);

		if (this.deckCards.length < 5) {
			this.discarded.forEach(card => {
				this.deckCards.push(card);
			});
			this.discarded = [];

			this.deckCards = this.shuffleCards(this.deckCards);
		}

		// fill hand from deck

		let cardList = this.deckCards.slice(0, 5);
		cardList.forEach(card => {
			this.logEvent(`Hand: Added ${card.id} to ${Names[this.id]}`);

			this.hand.push(card);
		});

		this.deckCards = this.deckCards.slice(5);

		console.log(this.hand);
		console.log(this.deckCards);
		console.log(this.discarded);

		// reset energy

		this.energy = this.maxEnergy;
	}

	playCard(card, handId) {
		this.logEvent(`Playing: ${Names[this.id]} played ${card.id}`);

		// check energy cost

		if (this.energy < card.energy) {
			this.logEvent(`Not enough energy left to play card.`);

			return false;
		}

		this.energy -= card.energy;

		// add to played cards

		this.played.push(card.id);

		// add to discard pile

		this.discarded.push(this.hand.find(card => {
			return card.handId === handId;
		}));

		// remove from hand

		this.hand = this.hand.filter(c => c.handId !== handId);

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

			console.log(`key ${key} effect ${effect} id ${this.id} streak ${streak}`);

			if (key === this.id) {
				let from = this.arousal;
				let delta = Math.sign(effect) * (Math.abs(effect) + streak);
				this.arousal = Math.max(0, this.arousal + delta);

				this.logEvent(`Effect: Added ${delta} to ${title}'s Arousal (${from} => ${this.arousal})`);
			}
		}
	}
};

export default Player;