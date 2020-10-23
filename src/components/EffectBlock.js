import React from 'react';

import Effect from './Effect';

import Names from '../data/Names.json';

import './EffectBlock.css';

class EffectBlock extends React.Component {
	render() {
		const { effect, turn, streak } = this.props;

		let condition;
		if (effect.condition) {
			let { stat, check, value } = effect.condition;
			condition = <h2>{Names[stat]} {Names[check]} {value}</h2>;
		}

		let effectItems = [];

		for (const [key, value] of Object.entries(effect.stats)) {
			effectItems.push(<Effect key={key} id={key} effect={value} turn={turn} streak={streak} />);
		}

		return (
			<React.Fragment>
				{condition}
				<ul className="m-effectBlock">
					{effectItems}
				</ul>
			</React.Fragment>
		);
	}
}

export default EffectBlock;