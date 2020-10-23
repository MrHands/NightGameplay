import React from 'react';

import EffectBlock from './EffectBlock';

import Names from '../data/Names.json';

import './Card.css';

class Card extends React.Component {
	render() {
		const { card, turn, streak } = this.props;

		return (
			<li className="m-card">
				<h1>{card.title}</h1>
				<h2>{Names[card.type]}</h2>
				{card.effects.map((effect, index) => {
					return <EffectBlock key={`block-${index}`} effect={effect} turn={turn} streak={streak} />;
				})}
				<h2>{Names[card.connection]}</h2>
			</li>
		);
	}
}

export default Card;