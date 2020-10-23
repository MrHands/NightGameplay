import React from 'react';
import './Effect.css';
import Names from '../data/Names.json';

class Effect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			lead: window.game.lead
		};
	}

	render() {
		let { lead } = this.state;
		const { id, effect } = this.props;

		let title = Names[id];

		if (lead === 'captain') {
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