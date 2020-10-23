import React from 'react';

import EffectBlock from './EffectBlock';

import Names from '../data/Names.json';

import './Card.css';

class Card extends React.Component {
	render() {
		const { card, turn, streak } = this.props;

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
				valid = streak == value;
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
			<li className="m-card">
				<h1>{card.title}</h1>
				<h2>{Names[card.type]}</h2>
				<EffectBlock effect={effect} turn={turn} streak={streak} />
				<h2>{Names[card.connection]}</h2>
			</li>
		);
	}
}

export default Card;