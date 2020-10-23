import React from 'react';

import Effect from './Effect';

import './EffectBlock.css';

class EffectBlock extends React.Component {
	render() {
		const { effect, turn } = this.props;

		let effectItems = [];

		for (const [key, value] of Object.entries(effect.stats)) {
			effectItems.push(<Effect key={key} id={key} effect={value} turn={turn} />);
		}

		return (
			<ul className="m-effectBlock">
				{effectItems}
			</ul>
		);
	}
}

export default EffectBlock;