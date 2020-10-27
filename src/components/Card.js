import React from 'react';

import EffectBlock from './EffectBlock';

import CardsDatabase from '../data/CardsDatabase.json';
import Names from '../data/Names.json';

import './Card.css';

class Card extends React.Component {
	render() {
		const { id, turn, streak, onPlay, onResolve } = this.props;

		let card = CardsDatabase.cards.find((card) => card.id === id);
		if (!card) {
			return (
				<li className="m-card -none">
				</li>
			);
		}

		let active = onResolve(card);

		return (
			<li className="m-card" card-id={card.id} onClickCapture={onPlay}>
				<h1 className="m-card__title">{card.title}</h1>
				<h2 className="m-card__type">Type is {Names[card.type]}</h2>
				<div className="m-card__effects">
					{card.effects.map((effect, index) => {
						let isActive = effect === active;
						return (
							<EffectBlock key={`effect-${index}`} effect={effect} active={isActive} turn={turn} streak={streak} />
						);
					})}
				</div>
				<h2 className="m-card__connection">Connects to {Names[card.connection]}</h2>
			</li>
		);
	}
}

export default Card;