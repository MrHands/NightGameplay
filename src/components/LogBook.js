import React from 'react';

import './LogBook.css';

class LogBook extends React.Component {
	render() {
		const { logBook } = this.props;

		return (
			<div>
				<h2>Logbook</h2>
				<ul className="m-logBook">
					{logBook.reverse().map((text, index) => <li key={`entry-${index}`} className="a-logEntry">{text}</li>)}
				</ul>
			</div>
		);
	}
}

export default LogBook;