import React from 'react';
import './Effect.css';

class Effect extends React.Component {
	render() {
		let { text, effect } = this.props;

		let effectText = effect.toString();
		if (effect >= 0) {
			effectText = '+' + effectText;
		}

		return (
			<li className="a-effect">
				<h2>{text}</h2>
				<h2>{effectText}</h2>
			</li>
		);
	}
}

export default Effect;