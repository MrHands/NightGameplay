import React from 'react';

import Card from './Card';

import './CardHand.css';

class CardHand extends React.Component {
	render() {
		const { owner, turn, streak, onPlay } = this.props;

		const items = owner.hand.map((id, index) => {
			return (
				<Card key={`card-${index}`} id={id} turn={turn} streak={streak} onPlay={onPlay} />
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