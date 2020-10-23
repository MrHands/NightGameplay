import React from 'react';
import './App.css';
import Hud from './components/Hud';
import CardList from './components/CardList';
import GameState from './GameState';

window.game = new GameState();

function App() {
	return (
		<div className="App">
			<Hud game={window.game} />
			<CardList></CardList>
		</div>
	);
}

export default App;
