import React from 'react';

import EffectBlock from './EffectBlock';

import CardsDatabase from '../data/CardsDatabase.json';
import Names from '../data/Names.json';

import './Card.css';

class Card extends React.Component {
	resolveEffect = (name, effect, streak, isLinked) => {
		let previous = effect;

		if (['captain', 'crew'].indexOf(name) > -1) {
			effect = (Math.abs(effect) + streak) * Math.sign(effect);
		}
		else if (isLinked && name === 'sexergy') {
			effect = effect * 2;
		}

		console.log(`name ${name} effect (${previous} => ${effect})`);

		return effect;
	}

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

		// resolve effects

		let effects = null;
		if (onResolve) {
			effects = onResolve(card, streak);
		}

		let isTooExpensive = player ? (player.energy < card.energy) : false;
		let playerClass = player ? (' -player -' + player.id) : '';

		let isLinkedFrom = linkFrom === id;

		let isLinkedTo = false;
		if (linkTo) {
			let found = CardsDatabase.cards.find((card) => card.id === linkTo);
			isLinkedTo = found.connection === card.type;
		}

		// render sexergy

		let eleSexergy;
		if (effects) {
			for (const [key, value] of Object.entries(effects.stats)) {
				if (key === 'sexergy') {
					eleSexergy = <div className="m-cardInfo__sexergy">{`💓+${value}`}</div>
				}
			}
		}

		// render effects

		let eleEffects;
		if (effects) {
			eleEffects = <div className="m-card__effects">
				<EffectBlock
					nameChange={`effect-${streak}`}
					effect={effects}
					active={true}
					turn={turn}
					streak={streak}
					isLinkedTo={isLinkedTo}
					onResolveEffect={this.resolveEffect}
				/>
			</div>;
		}

		console.log(`${id} ${streak}`)

		return (
			<li className={`m-card${playerClass}${isDiscarded ? ' -discarded' : ''}`} disabled={isTooExpensive} card-id={card.id} card-hand-id={handId} onClickCapture={onPlay}>
				<div className="m-cardInfo">
					<div className="m-cardInfo__energy">{`⚡${card.energy}`}</div>
					{eleSexergy}
				</div>
				<h1 className="m-card__title">{card.title}</h1>
				<div className="m-cardInfo__type">
					<span className={`a-type ${isLinkedTo ? ' -link' : ''}`}>{Names[card.type]}</span>
				</div>
				{eleEffects}
				<div className="m-card__connection">Connects to <span className={`a-type ${isLinkedFrom ? ' -link' : ''}`}>{Names[card.connection]}</span></div>
			</li>
		);
	}
}

export default Card;