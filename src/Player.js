import Names from './data/Names.json';

class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.leading = false;
		this.arousal = 0;
		this.deck = [];
		this.hand = [];
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
				console.log(`Add ${streak * value} to ${title}'s Arousal`);

				this.arousal += streak * value;
			} else if (key === 'theirs' && turn !== this.id) {
				console.log(`Add ${streak * value} to ${title}'s Arousal`);

				this.arousal += streak * value;
			}
		}
	}
};

export default Player;