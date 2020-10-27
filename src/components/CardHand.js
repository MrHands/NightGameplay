import React from 'react';

import Card from './Card';

import './CardHand.css';

class CardHand extends React.Component {
	render() {
		const { player, turn, streak, onPlay, onResolve } = this.props;

		const items = player.hand.map((id, index) => {
			return (
				<Card key={`card-${index}`} id={id} player={player} turn={turn} streak={streak} onPlay={onPlay} onResolve={onResolve} />
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