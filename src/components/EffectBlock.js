import React from 'react';

import Effect from './Effect';

import Names from '../data/Names.json';

import './EffectBlock.css';

class EffectBlock extends React.Component {
	render() {
		const { active, effect, turn, streak } = this.props;

		let condition;
		if (effect.condition) {
			let { stat, check, value } = effect.condition;
			condition = <h2 className="m-effectBlock__condition">{Names[stat]} {Names[check]} {value}</h2>;
		}

		let effectItems = [];

		for (const [key, value] of Object.entries(effect.stats)) {
			effectItems.push(<Effect key={key} id={key} effect={value} turn={turn} streak={streak} />);
		}

		return (
			<div className={`m-effectBlock ${active ? '-active' : ''}`}>
				{condition}
				<ul className="a-effectList">
					{effectItems}
				</ul>
			</div>
		);
	}
}

export default EffectBlock;