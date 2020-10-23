import React from 'react';
import CardsDatabase from './data/CardsDatabase.json';

class Card extends React.Component {
	componentWillMount() {
		let { id } = this.props;

		let card = CardsDatabase.cards.find((item) => {
			return item.id === id;
		});

		this.setState({
			title: card.title,
			type: card.type
		});
	}

	render() {
		return (
			<div>
				<h1>{this.state.title}</h1>
				<h2>{this.state.type}</h2>
			</div>
		);
	}
}

export default Card;