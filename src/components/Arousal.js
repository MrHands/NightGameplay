import React from 'react';
import Progress from './Progress';
import './Arousal.css';

class Arousal extends React.Component {
	componentWillMount() {
		let { player } = this.props;

		this.setState({
			value: player.arousal,
		});
	}

	render() {
		let { player } = this.props;
		let { value } = this.state;

		return (
			<div className="m-arousal">
				<h2>{player.name}</h2>
				<Progress min="0" max="100" value={value} />
			</div>
		);
	}
}

export default Arousal;