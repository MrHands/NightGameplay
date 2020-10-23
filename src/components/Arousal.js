import React from 'react';
import Progress from './Progress';
import './Arousal.css';

class Arousal extends React.Component {
	render() {
		let { player } = this.props;

		return (
			<div className="m-arousal">
				<h2>{player.name}</h2>
				<Progress min="0" max="100" value={player.arousal} />
			</div>
		);
	}
}

export default Arousal;