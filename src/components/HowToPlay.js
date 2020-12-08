import React from 'react';

import './HowToPlay.css';

class HowToPlay extends React.Component {
	render() {
		return (
			<div className="m-howToPlay">
				<h2>What is this?</h2>
				<p>This is a prototype for the night gameplay in Up There They Love, made using React.</p>
				<p>In this prototype, you play as both the Captain and the Crew Member. In the final game, the Crew Member will be played by an AI.</p>
				<p>Your goal is to fill the Crew Member's Arousal bar at the top of the screen. At the same time, the Crew Member is trying to fill your bar. The best outcome is for both bars to be filled at the same time.</p>
				<p>You start each turn with five cards in your hand, drawn from your deck. You can play as many cards as you want in your turn, but each card has an energy cost. Your energy resets at the start of your turn.</p>
				<p>Cards can have a combination of three effects: add to your Arousal, add to your partner's Arousal and add to the Streak. The Streak is used as a bonus on the Arousal effects and is shared between both players.</p>
				<p>When you end your turn, the cards from the table and in your hand are moved to your discard pile. However, the last card you played is left on the table. The next player needs to look at what type your card connects with.</p>
				<p>When the first card you play matches the connection type of the previous player's card, the streak is maintained. Otherwise, the streak is reset to 0. This rule does not apply to subsequent cards you play, it <i>only</i> applies to the first card of your turn.</p>
				<p>If your deck is empty, your discard pile is reshuffled and added back to your deck.</p>
				<p>Note that you always play two cards at the end of each round: the one that was on the table previously and the one that was just put down.</p>
				<h2>How to play</h2>
				<ul>
					<li>Press "Start game" to start playing</li>
					<li>Click on a card from your hand to place it on the table</li>
					<li>Play cards until you are satisfied or when you run out of energy</li>
					<li>Press "End Turn" to end your turn</li>
					<li>Keep playing until the bars fill up</li>
				</ul>
			</div>
		);
	}
}

export default HowToPlay;