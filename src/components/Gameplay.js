import React from 'react';

import Table from './Table';
import Card from './Card';

import './Gameplay.css';

class Gameplay extends React.Component {
	render() {
		const {
			discardPile,
			cardPrevious,
			cardNext,
			tableCards,
			cardLink,
			turn,
			streak,
			onResolve
		} = this.props;

		return (
			<section className="o-gameplay">
				<div>
					<h1>Discard pile</h1>
					<ul className="m-discardPile">
						{discardPile.reverse().map((card, index) => {
							return (<Card id={card} key={`discarded-${index}`} isDiscarded={true} />);
						})}
					</ul>
				</div>
				<div>
					<h1>On the table</h1>
					<Table
						cardPrevious={cardPrevious}
						cardNext={cardNext}
						tableCards={tableCards}
						cardLink={cardLink}
						turn={turn}
						streak={streak}
						onResolve={onResolve} />
				</div>
			</section>
		);
	}
}

export default Gameplay;