import React from 'react';

import Card from './Card';

import './CardHand.css';

class CardHand extends React.Component {
	render() {
		const {
			cards,
			player,
			turn,
			streak,
			cardLink,
			onPlay,
			onResolve
		} = this.props;

		return (
			<ul className="m-cardHand">
				{cards.map((card, index) => {
					return (
						<Card
							key={`card-${index}`}
							id={card.id}
							handId={card.handId}
							player={player}
							turn={turn}
							streak={streak}
							linkTo={cardLink}
							onPlay={onPlay}
							onResolve={onResolve}
						/>
					);
				})}
			</ul>
		);
	}
}

export default CardHand;