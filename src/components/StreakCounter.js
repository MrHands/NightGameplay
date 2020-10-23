import React from 'react';

import './StreakCounter.css';

class StreakCounter extends React.Component {
	render() {
		const { streak } = this.props;

		return (
			<h2 className="a-streakCounter">{streak}x</h2>
		);
	}
}

export default StreakCounter;