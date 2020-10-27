import React from 'react';

import './LogBook.css';

class LogBook extends React.Component {
	render() {
		const { logBook } = this.props;

		return (
			<ul className="m-logBook">
				{logBook.map((text, index) => <li key={`entry-${index}`} className="a-logEntry">{text}</li>)}
			</ul>
		);
	}
}

export default LogBook;