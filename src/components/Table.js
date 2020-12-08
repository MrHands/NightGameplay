import React from 'react';

import Card from './Card';

import './Table.css';

class Table extends React.Component {
	render() {
		const { cardPrevious, tableCards, turn, streak, onResolve } = this.props;

		return (
			<ul className="m-table">
				<Card id={cardPrevious} turn={turn} streak={streak} onResolve={onResolve} />
				{tableCards.map((card, index) => {
					return <Card id={card} key={`table-${index}`} turn={turn} streak={streak} onResolve={onResolve} />
				})}
				<Card />
			</ul>
		);
	}
}

export default Table;