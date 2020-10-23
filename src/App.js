import React from 'react';
import './App.css';
import Arousal from './components/Arousal';
import CardList from './components/CardList';
import GameState from './GameState';

window.game = new GameState();

function App() {
	return (
		<div className="App">
			<Arousal player={window.game.captain} />
			<Arousal player={window.game.crew} />
			<CardList />
		</div>
	);
}

export default App;
