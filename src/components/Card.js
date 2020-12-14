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

		let sexergy;
		if (active) {
			for (const [key, value] of Object.entries(active.stats)) {
				if (key === 'sexergy') {
					sexergy = <div className="m-cardInfo__sexergy">{`+${value}`}</div>
				}
			}
		}

		return (
			<li className={`m-card${playerClass}${isDiscarded ? ' -discarded' : ''}`} disabled={isTooExpensive} card-id={card.id} card-hand-id={handId} onClickCapture={onPlay}>
				<div className="m-cardInfo">
					<div className="m-cardInfo__energy">{`⚡${card.energy}`}</div>
					<div className="m-cardInfo__type">
						<span className={`a-type ${isLinkedTo ? ' -link' : ''}`}>{Names[card.type]}</span>
					</div>
					{sexergy}
				</div>
				<h1 className="m-card__title">{card.title}</h1>
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