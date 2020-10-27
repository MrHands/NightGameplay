import React from 'react';

import Names from '../data/Names.json';

import './StreakCounter.css';

class StreakCounter extends React.Component {
	render() {
		const { streak } = this.props;

		return (
			<div className="m-streakCounter">
				<h2 className="m-streakCounter__name">{Names['streak']}</h2>
				<h2 className="m-streakCounter__text">{streak}x</h2>
			</div>
		);
	}
}

export default StreakCounter;