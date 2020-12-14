import React from 'react';

import Names from '../data/Names.json';

import './Effect.css';

class Effect extends React.Component {
	render() {
		const {
			id,
			effect,
			turn,
			streak
		} = this.props;

		let title = Names[id];

		if (turn === 'captain') {
			if (id === 'mine') {
				title = Names['captain'];
			} else if (id === 'theirs') {
				title = Names['crew'];
			}
		} else {
			if (id === 'mine') {
				title = Names['crew'];
			} else if (id === 'theirs') {
				title = Names['captain'];
			}
		}

		let effectText;
		
		if (['mine', 'theirs', 'captain', 'crew'].indexOf(id) > -1) {
			effectText = ((Math.abs(effect) + streak) * Math.sign(effect)).toString();
		} else {
			effectText = effect.toString();
		}

		if (effect >= 0) {
			effectText = '+' + effectText;
		}

		return (
			<li className="a-effect">
				<div>{title}</div>
				<div className="a-effect__value">{effectText}</div>
			</li>
		);
	}
}

export default Effect;