import React from 'react';

import EffectBlock from './EffectBlock';

import CardsDatabase from '../data/CardsDatabase.json';
import Names from '../data/Names.json';

import './Card.css';

class Card extends React.Component {
	render() {
		const { id, turn, streak, onPlay } = this.props;

		let card = CardsDatabase.cards.find((card) => card.id === id);
		if (!card) {
			return (
				<li className="m-card -none">
				</li>
			);
		}

		let defaultEffect = card.effects.find((effect) => {
			return !effect.condition;
		});

		let effect = defaultEffect;

		let conditionalEffect = card.effects.find((effect) => {
			return effect.condition;
		});
		if (conditionalEffect) {
			let { check, value } = conditionalEffect.condition;

			let valid = false;
			if (check === 'equal') {
				valid = streak === value;
			} else if (check === 'greater-than') {
				valid = streak > value;
			} else if (check === 'greater-than-equal') {
				valid = streak >= value;
			}  else if (check === 'less-than') {
				valid = streak < value;
			} else if (check === 'less-than-equal') {
				valid = streak <= value;
			}

			if (valid) {
				effect = conditionalEffect;
			}
		}

		return (
			<li className="m-card" card-id={card.id} onClickCapture={onPlay}>
				<h1 className="m-card__title">{card.title}</h1>
				<h2 className="m-card__type">{Names[card.type]}</h2>
				<EffectBlock className="m-card__effects" effect={effect} turn={turn} streak={streak} />
				<h2 className="m-card__connection">{Names[card.connection]}</h2>
			</li>
		);
	}
}

export default Card;