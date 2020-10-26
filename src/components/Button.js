import React from 'react';

import './Button.css';

class EndTurn extends React.Component {
	render() {
		const { children, onClick } = this.props;

		return (
			<button className="a-button" onClick={onClick}>
				{children}
			</button>
		);
	}
}

export default EndTurn;