import React from 'react';
import Arousal from './Arousal';
import StreakCounter from './StreakCounter';
import './Hud.css';

class Hud extends React.Component {
	render() {
		let { game } = this.props;

		return (
			<div className="o-hud">
				<Arousal player={game.captain} />
				<StreakCounter value={game.streak} />
				<Arousal player={game.crew} />
			</div>
		);
	}
}

export default Hud;