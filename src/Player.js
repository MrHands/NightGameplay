class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.leading = false;
		this.arousal = 0;
		this.deck = [];
		this.hand = [];
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
	
	applyCard(card, turn, streak) {
		let block = this.getActiveEffectBlock(card, streak);

		for (const [key, value] of Object.entries(block.stats)) {
			if (key === 'mine' && turn === this.id) {
				this.arousal += streak * value;
			}
		}
	}
};

export default Player;