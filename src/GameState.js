class Player {
	constructor(id, name) {
		this.id = id;
		this.name = name;
		this.leading = false;
		this.arousal = 0;
		this.deck = [];
		this.hand = [];
	}
}

class GameState {
	constructor() {
		this.lead = 'captain';
		this.captain = new Player('captain', 'Captain');
		this.crew = new Player('crew', 'Crew Member');
	}
};

export default GameState;