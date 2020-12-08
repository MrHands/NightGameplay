import React from 'react';

import Card from './Card';

import './CardHand.css';

class CardHand extends React.Component {
	render() {
		const {
			player,
			turn,
			streak,
			cardLink,
			onPlay,
			onResolve
		} = this.props;

		return (
			<ul className="m-cardHand">
				{player.hand.map((id, index) => {
					return (
						<Card key={`card-${index}`} id={id} player={player} turn={turn} streak={streak} linkTo={cardLink} onPlay={onPlay} onResolve={onResolve} />
					);
				})}
			</ul>
		);
	}
}

export default CardHand;