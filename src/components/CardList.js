import React from 'react';
import CardsDatabase from '../data/CardsDatabase.json';
import Card from './Card';
import './CardList.css';

class CardList extends React.Component {
	render() {
		const items = CardsDatabase.cards.map((card) => <Card id={card.id} />);

		return (
			<ul className="m-cardList">{items}</ul>
		);
	}
}

export default CardList;