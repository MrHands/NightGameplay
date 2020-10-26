import React from 'react';

import Card from './Card';

import './Table.css';

class Table extends React.Component {
	render() {
		const { table, turn, streak } = this.props;

		return (
			<ul className="m-table">
				<Card card={table.captain} turn={turn} streak={streak} />
                <Card card={table.crew} turn={turn} streak={streak} />
			</ul>
		);
	}
}

export default Table;