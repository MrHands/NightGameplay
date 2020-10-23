import React from 'react';

import Card from './Card';

import CardsDatabase from '../data/CardsDatabase.json';

import './CardHand.css';

class CardHand extends React.Component {
	render() {
		const { owner, turn, streak } = this.props;

		const items = owner.hand.map((id, index) => {
			let card = CardsDatabase.cards.find((card) => card.id === id);

			return (
				<Card key={`card-${index}`} card={card} turn={turn} streak={streak} />
			);
		});

		return (
			<ul className="m-cardHand">
				{items}
			</ul>
		);
	}
}

export default CardHand;