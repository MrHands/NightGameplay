import React from 'react';

import EffectBlock from './EffectBlock';

import CardsDatabase from '../data/CardsDatabase.json';
import Names from '../data/Names.json';

import './Card.css';

class Card extends React.Component {
	render() {
		const {
			id,
			handId,
			player,
			turn,
			streak,
			linkFrom,
			linkTo,
			isDiscarded,
			onPlay,
			onResolve
		} = this.props;

		let card = CardsDatabase.cards.find((card) => card.id === id);
		if (!card) {
			return (
				<li className="m-card -none">
				</li>
			);
		}

		let active = onResolve ? onResolve(card) : null;
		let isTooExpensive = player ? (player.energy < card.energy) : false;
		let playerClass = player ? (' -' + player.id) : '';

		let isLinkedFrom = linkFrom === id;

		let isLinkedTo = false;
		if (linkTo) {
			let found = CardsDatabase.cards.find((card) => card.id === linkTo);
			isLinkedTo = found.connection === card.type;
		}

		return (
			<li className={`m-card${playerClass}${isDiscarded ? ' -discarded' : ''}`} disabled={isTooExpensive} card-id={card.id} card-hand-id={handId} onClickCapture={onPlay}>
				<h1 className="m-card__title">{card.title}</h1>
				<div className="m-card__type">
					<span className={`a-type ${isLinkedTo ? ' -link' : ''}`}>{Names[card.type]}</span>
				</div>
				<h2 className="m-card__energy">Energy Cost {card.energy}</h2>
				<div className="m-card__effects">
					{card.effects.map((effect, index) => {
						let isActive = effect === active;
						return (
							<EffectBlock key={`effect-${index}`} effect={effect} active={isActive} turn={turn} streak={streak} />
						);
					})}
				</div>
				<div className="m-card__connection">Connects to <span className={`a-type ${isLinkedFrom ? ' -link' : ''}`}>{Names[card.connection]}</span></div>
			</li>
		);
	}
}

export default Card;