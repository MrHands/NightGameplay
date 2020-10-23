import React from 'react';
import Effect from './Effect';
import './EffectBlock.css';

class EffectBlock extends React.Component {
	render() {
		let { effect } = this.props;

		let effectItems = [];

		for (const [key, value] of Object.entries(effect.stats)) {
			effectItems.push(<Effect id={key} effect={value} />);
		}

		return (
			<ul className="m-effectBlock">
				{effectItems}
			</ul>
		);
	}
}

export default EffectBlock;