import React from 'react';
import CardsDatabase from '../data/CardsDatabase.json';
import Card from './Card';
import './CardHand.css';

class CardHand extends React.Component {
	render() {
		const { owner } = this.props;

		const items = owner.hand.map((id, index) => {
			let key = `card-${index}`;
			let card = CardsDatabase.cards.find((card) => card.id === id);

			return (
				<Card key={key} id={card.id} />
			);
		});

		return (
			<ul className="m-cardHand">{items}</ul>
		);
	}
}

export default CardHand;