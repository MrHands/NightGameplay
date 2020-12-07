import Names from './data/Names.json';

class Player {
	constructor(id, name, logEvent) {
		this.id = id;
		this.name = name;
		this.logEvent = logEvent;
		this.leading = false;
		this.arousal = 0;
		this.energy = 5;
		this.deck = [];
		this.hand = [];
	}

	endTurn() {
		// fill hand from deck

		let newCards = Math.max(Math.min(5, this.deck.length), this.hand.length) - this.hand.length;
		let cardList = this.deck.slice(0, newCards);

		cardList.forEach(card => {
			this.logEvent(`Hand: Added ${card} to ${Names[this.id]}`);

			this.hand.push(card);
		});

		this.deck = this.deck.filter(card => cardList.indexOf(card) === -1);

		// reset energy

		this.energy = 5;
	}

	playCard(card) {
		this.logEvent(`Playing: ${Names[this.id]} played ${card.id}`);

		if (this.energy < card.energy) {
			this.logEvent(`Not enough energy left to play card.`);

			return false;
		}

		this.energy -= card.energy;

		// remove from hand

		this.hand = this.hand.filter(c => c !== card.id);

		return true;
	}
	
	applyEffects(effects, turn, streak) {
		for (const [key, value] of Object.entries(effects.stats)) {
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
				this.arousal += (value + streak) * Math.sign(value);
				this.arousal = Math.max(0, this.arousal);

				this.logEvent(`Effect: Added ${streak * value} to ${title}'s Arousal (${from} => ${this.arousal})`);
			}
		}
	}
};

export default Player;