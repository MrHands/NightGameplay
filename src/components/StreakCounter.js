import React from 'react';
import './StreakCounter.css';

class StreakCounter extends React.Component {
	render() {
		let { value } = this.props;

		return (
			<h2 className="a-streakCounter">{value}x</h2>
		);
	}
}

export default StreakCounter;