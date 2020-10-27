import Names from './data/Names.json';

class Player {
	constructor(id, name, logEvent) {
		this.id = id;
		this.name = name;
		this.logEvent = logEvent;
		this.leading = false;
		this.arousal = 0;
		this.deck = [];
		this.hand = [];
	}

	fillHand() {
		console.log(this.id);

		let newCards = Math.max(Math.min(5, this.deck.length), this.hand.length) - this.hand.length;
		let cardList = this.deck.slice(0, newCards);

		cardList.forEach(card => {
			this.logEvent(`${Names[this.id]} added ${card} to hand`);

			this.hand.push(card);
		});

		this.deck = this.deck.filter(card => cardList.indexOf(card) === -1);
	}

	playCard(card) {
		this.logEvent(`${Names[this.id]} played ${card}`);

		this.hand = this.hand.filter(c => c !== card);
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

			if (key === 'mine' && turn === this.id) {
				let from = this.arousal;
				this.arousal += streak * value;

				this.logEvent(`Added ${streak * value} to ${title}'s Arousal (${from} => ${this.arousal})`);
			} else if (key === 'theirs' && turn !== this.id) {
				let from = this.arousal;
				this.arousal += streak * value;

				this.logEvent(`Added ${streak * value} to ${title}'s Arousal (${from} => ${this.arousal})`);
			}
		}
	}
};

export default Player;