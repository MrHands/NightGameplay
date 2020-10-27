import React from 'react';
import './Progress.css';

class Progress extends React.Component {
	render() {
		let { min, max, value } = this.props;

		let style = {
			width: (((value - min) / (max - min)) * 100) + '%'
		};

		return (
			<div className="a-progress">
				<div className="a-progress__foreground" style={style}></div>
				<div className="a-progress__text">{value - min} / {max - min}</div>
			</div>
		);
	}
}

export default Progress;