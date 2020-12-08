import React from 'react';

import Card from './Card';

import './Table.css';

class Table extends React.Component {
	render() {
		const {
			cardPrevious,
			tableCards,
			turn, 
			streak,
			onResolve
		} = this.props;

		let previous;
		if (cardPrevious) {
			previous = <Card id={cardPrevious} turn={turn} streak={streak} onResolve={onResolve} />;
		}

		return (
			<ul className="m-table">
				{previous}
				{tableCards.map((card, index) => {
					return <Card id={card} key={`table-${index}`} turn={turn} streak={streak} onResolve={onResolve} />
				})}
				<Card />
			</ul>
		);
	}
}

export default Table;