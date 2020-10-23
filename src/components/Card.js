import React from 'react';
import EffectBlock from './EffectBlock';
import Names from '../data/Names.json';
import './Card.css';

class Card extends React.Component {
	render() {
		let { card } = this.props;

		return (
			<li className="m-card">
				<h1>{card.title}</h1>
				<h2>{Names[card.type]}</h2>
				{card.effects.map((effect) => {
					return <EffectBlock effect={effect} />;
				})}
				<h2>{Names[card.connection]}</h2>
			</li>
		);
	}
}

export default Card;