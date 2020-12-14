import React from 'react';

import Effect from './Effect';

import Names from '../data/Names.json';

import './EffectBlock.css';

class EffectBlock extends React.Component {
	render() {
		const {
			nameChange,
			active,
			effect,
			streak,
			isLinkedTo,
			onResolveEffect,
		} = this.props;

		let condition;
		if (effect.condition) {
			let { stat, check, value } = effect.condition;
			condition = <h2 className="m-effectBlock__condition">{Names[stat]} {Names[check]} {value}</h2>;
		}

		// console.log(`EffectBlock: nameChange ${nameChange} streak ${effect.streak}`);

		return (
			<div className={`m-effectBlock ${active ? '-active' : ''}`}>
				{condition}
				<ul className="a-effectList">
					{Object.keys(effect.stats).filter((key) => key !== 'sexergy').map((key) => {
						return <Effect
							key={`${nameChange}-${key}`}
							id={key}
							effect={effect.stats[key]}
							streak={streak}
							isLinkedTo={isLinkedTo}
							onResolveEffect={onResolveEffect}
						/>;
					})}
				</ul>
			</div>
		);
	}
}

export default EffectBlock;