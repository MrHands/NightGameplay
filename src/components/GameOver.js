import React from 'react';

import CardHand from './CardHand';
import Hud from './Hud';

import Names from '../data/Names.json';

import './GameOver.css';

class GameOver extends React.Component {
	render() {
		const {
			captain,
			crew,
			streak
		} = this.props;

		let captainCards = captain.played.map((card, index) => {
			return {
				id: card,
				handId: index
			};
		});

		let crewCards = crew.played.map((card, index) => {
			return {
				id: card,
				handId: index
			};
		});

		return (
			<section className="o-gameOver">
				<Hud
					captain={captain}
					crew={crew}
					streak={streak}
				/>
				<h2>{`Cards played by ${Names[captain.id]}`}</h2>
				<CardHand
					cards={captainCards}
					player={captain}
					streak={1}
				/>
				<h2>{`Cards played by ${Names[crew.id]}`}</h2>
				<CardHand
					cards={crewCards}
					player={crew}
					streak={1}
				/>
			</section>
		);
	}
}

export default GameOver;