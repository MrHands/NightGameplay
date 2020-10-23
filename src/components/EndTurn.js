import React from 'react';

import Names from '../data/Names.json';

import './EndTurn.css';

class EndTurn extends React.Component {
	render() {
		const { turn, onClick } = this.props;

		return (
			<button className="a-endTurn" onClick={onClick}>
				End {Names[turn]}'s turn
			</button>
		);
	}
}

export default EndTurn;