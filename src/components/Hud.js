import React from 'react';

import Arousal from './Arousal';
import StreakCounter from './StreakCounter';

import './Hud.css';

class Hud extends React.Component {
	render() {
		const { captain, crew, streak } = this.props;

		return (
			<div className="o-hud">
				<Arousal player={captain} />
				<StreakCounter streak={streak} />
				<Arousal player={crew} />
			</div>
		);
	}
}

export default Hud;