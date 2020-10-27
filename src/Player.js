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
			if (key === 'mine' && turn === this.id) {
				this.arousal += streak * value;
			} else if (key === 'theirs' && turn !== this.id) {
				this.arousal += streak * value;
			}
		}
	}
};

export default Player;