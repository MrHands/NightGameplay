import React from 'react';

import CardHand from './CardHand';

import Names from '../data/Names.json';

import './PlayerBar.css';

class PlayerBar extends React.Component {
	render() {
		let {
			player,
			turn,
			streak,
			cardLink,
			onPlay,
			onResolve,
		} = this.props;

		return (
			<React.Fragment>
				<ul className="m-playerBar">
					<li className="m_playerBar__item -turn">{`${Names[turn]}'s turn`}</li>
					<li className="m_playerBar__item -energy">{`${Names['energy']}: ${player.energy} / ${player.maxEnergy}`}</li>
				</ul>
				<CardHand
					cards={player.hand}
					player={player}
					turn={turn}
					streak={streak}
					cardLink={cardLink}
					onPlay={onPlay}
					onResolve={onResolve}
				/>
			</React.Fragment>
		);
	}
}

export default PlayerBar;