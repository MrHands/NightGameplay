import React from 'react';

import Names from '../data/Names.json';

import './HowToPlay.css';

class HowToPlay extends React.Component {
	render() {
		const loca = (value) => {
			return <b>{Names[value]}</b>;
		}

		return (
			<div className="m-howToPlay">
				<h2>What is this?</h2>
					<p>This is a prototype for the night gameplay in <i>Up There They Love</i>, made using React. The game is a combination of a visual novel, a worker placement game and a card game. You will play this card game with one of the three crew members at the end of each in-game day.</p>
				<h2>Goals</h2>
					<p>You have two goals in the game: fill the {loca('arousal')} of the other player before they fill yours and to try and get the highest possible {loca('sexergy')} (Sexual Energy) score.</p>
					<p>In this prototype, you play as both the {loca('captain')} and the {loca('crew')}. In the final game, the {loca('crew')} will be played by an AI.</p>
				<h2>How to play</h2>
					<p>You start each turn with five cards in your hand, drawn from your deck. Each card costs {loca('energy')} and gives you {loca('sexergy')}. You can play as many cards as you have energy left. Your {loca('energy')} resets at the start of your turn.</p>
					<p>Cards can have a combination of three effects: add to your {loca('arousal')}, add to your partner's {loca('arousal')} and add to the {loca('streak')}. The {loca('streak')} is used as a bonus on the {loca('arousal')} effects and is shared between both players.</p>
				<h2>Bonuses</h2>
					<p>Each card has a type, which can be {loca('passionate')}, {loca('intimate')} or {loca('dominant')}. It also has a connection type, which specifies what type of card should ideally be played next. When the connection type of the last played card matches with the type of the card you playe, you will get a bonus for playing that card.</p>
					<p>Whenever the connection type matches, you will get double the {loca('sexergy')} for that card. When you match the type played by the other player, the {loca('streak')} is maintained. Otherwise, it is reset to 0.</p>
					<p>After playing the first card from your hand, the card from the previous player is discarded.</p>
				<h2>Ending your turn</h2>
					<p>When you end your turn, the cards from the table and in your hand are moved to your discard pile. However, the last card you played is left on the table. The next player needs to look at what type your card connects with.</p>
				<h2>Shuffling the deck</h2>
					<p>If your deck is empty, your discard pile is reshuffled and added back to your deck.</p>
			</div>
		);
	}
}

export default HowToPlay;