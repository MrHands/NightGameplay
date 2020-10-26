import React from 'react';

import Card from './Card';

import './Table.css';

class Table extends React.Component {
	render() {
		const { cardCaptain, cardCrew, turn, streak } = this.props;
		
		console.log(`cardCaptain ${cardCaptain} cardCrew ${cardCrew}`);

		return (
			<ul className="m-table">
				<Card id={cardCaptain} turn={turn} streak={streak} />
				<Card id={cardCrew} turn={turn} streak={streak} />
			</ul>
		);
	}
}

export default Table;