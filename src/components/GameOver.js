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
			sexergy,
			streak,
			round,
			onResolve,
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
					sexergy={sexergy}
				/>
				<div className="m-victory">
					<h1 className="m-victory__title">{`${round - 1} rounds played`}</h1>
				</div>
				<section className="m-cardsPlayed">
					<div>
						<h2>{`${Names[captain.id]} played ${captainCards.length} card(s):`}</h2>
						<CardHand
							cards={captainCards}
							player={captain}
							streak={1}
							onResolve={onResolve}
						/>
					</div>
					<div>
						<h2>{`${Names[crew.id]} played ${crewCards.length} card(s):`}</h2>
						<CardHand
							cards={crewCards}
							player={crew}
							streak={1}
							onResolve={onResolve}
						/>
					</div>
				</section>
				<div className="m-victory">
					<h1 className="m-victory__title">Thanks for playing!</h1>
				</div>
			</React.Fragment>
		);
	}
}

export default GameOver;