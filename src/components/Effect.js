import React from 'react';

import Names from '../data/Names.json';

import './Effect.css';

class Effect extends React.Component {
	render() {
		const {
			id,
			key,
			effect,
			streak,
			isLinkedTo,
			onResolveEffect,
		} = this.props;

		let value = onResolveEffect(id, effect, streak, isLinkedTo);
		let valueText = value.toString();

		if (value >= 0) {
			valueText = '+' + valueText;
		}

		return (
			<li className="a-effect" effect-key={key}>
				<div>{Names[id]}</div>
				<div className="a-effect__value">{valueText}</div>
			</li>
		);
	}
}

export default Effect;