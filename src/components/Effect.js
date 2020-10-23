import React from 'react';
import './Effect.css';
import Names from '../data/Names.json';

class Effect extends React.Component {
	render() {
		let { id, effect } = this.props;

		let title = Names[id];
		if (id == 'mine') {
			title = Names['captain'];
		} else if (id == 'theirs') {
			title = Names['crew'];
		}

		let effectText = effect.toString();
		if (effect >= 0) {
			effectText = '+' + effectText;
		}

		return (
			<li className="a-effect">
				<div>{title}</div>
				<div>{effectText}</div>
			</li>
		);
	}
}

export default Effect;