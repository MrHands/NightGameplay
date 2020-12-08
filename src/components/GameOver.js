import React from 'react';

import CardHand from './CardHand';
import Hud from './Hud';

import Names from '../data/Names.json';

import './GameOver.css';

class GameOver extends React.Component {
	render() {
		const {
			winner,
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
			<React.Fragment>
				<div className="m-victory">
					<h1 className="m-victory__title">{`Bliss achieved by ${Names[winner.id]}`}</h1>
				</div>
				<Hud
					captain={captain}
					crew={crew}
					streak={streak}
				/>
				<section className="m-cardsPlayed">
					<div>
						<h2>{`Cards played by ${Names[captain.id]}`}</h2>
						<CardHand
							cards={captainCards}
							player={captain}
							streak={1}
						/>
					</div>
					<div>
						<h2>{`Cards played by ${Names[crew.id]}`}</h2>
						<CardHand
							cards={crewCards}
							player={crew}
							streak={1}
						/>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

export default GameOver;