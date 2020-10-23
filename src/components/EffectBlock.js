import React from 'react';
import Effect from './Effect';
import './EffectBlock.css';

class EffectBlock extends React.Component {
	render() {
		let { effect } = this.props;

		let mine;
		if (effect.stats.mine) {
			mine = <Effect text="Mine" effect={effect.stats.mine} />;
		}

		let theirs;
		if (effect.stats.theirs) {
			theirs = <Effect text="Theirs" effect={effect.stats.theirs} />;
		}

		let streak;
		if (effect.stats.streak) {
			theirs = <Effect text="Streak" effect={effect.stats.streak} />;
		}

		return (
			<ul className="m-effectBlock">
				{mine}
				{theirs}
				{streak}
			</ul>
		);
	}
}

export default EffectBlock;