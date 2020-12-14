import React from 'react';
import Progress from './Progress';
import './Arousal.css';

class Arousal extends React.Component {
	render() {
		let {
			player,
			reversed
		} = this.props;

		return (
			<div className={`m-arousal ${reversed ? '-left' : ''}`}>
				<h2>{player.name} Arousal</h2>
				<Progress min="0" max={player.maxArousal} value={player.arousal} reversed={reversed} />
			</div>
		);
	}
}

export default Arousal;