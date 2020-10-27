import React from 'react';

import Card from './Card';

import './Table.css';

class Table extends React.Component {
	render() {
		const { cardPrevious, cardNext, turn, streak, onResolve } = this.props;

		return (
			<ul className="m-table">
				<Card id={cardPrevious} turn={turn} streak={streak} onResolve={onResolve} />
				<Card id={cardNext} turn={turn} streak={streak} onResolve={onResolve} />
			</ul>
		);
	}
}

export default Table;