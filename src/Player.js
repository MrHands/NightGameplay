class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.leading = false;
		this.arousal = 0;
		this.deck = [];
		this.hand = [];
	}
};

export default Player;