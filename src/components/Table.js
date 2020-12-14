import React from 'react';

import Card from './Card';

import './Table.css';

class Table extends React.Component {
	render() {
		const {
			cardLink,
			tableCards,
			turn, 
			streak,
			onResolve
		} = this.props;

		console.log(`cardLink ${cardLink}`);

		return (
			<ul className="m-table">
				{tableCards.slice(0, -1).map((card, index) => {
					return <Card
						id={card}
						key={`card-inactive-${index}`}
						turn={turn}
						streak={streak}
						onResolve={onResolve}
					/>
				})}
				{tableCards.slice(-1).map((card, index) => {
					return <Card
						id={card}
						key={`card-active-${index}`}
						linkFrom={cardLink}
						turn={turn}
						streak={streak}
						onResolve={onResolve}
					/>
				})}
				<Card />
			</ul>
		);
	}
}

export default Table;