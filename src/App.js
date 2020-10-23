import React from 'react';
import './App.css';
import Hud from './components/Hud';
import CardHand from './components/CardHand';
import GameState from './GameState';

window.game = new GameState();
window.game.captain.hand = [ 'passionate-1', 'passionate-1', 'passionate-1', 'dominant-1', 'intimate-1' ];

function App() {
	return (
		<React.Fragment>
			<Hud game={window.game} />
			<CardHand owner={window.game.captain} />
		</React.Fragment>
	);
}

export default App;
