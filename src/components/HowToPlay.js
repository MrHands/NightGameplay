import React from 'react';

import './HowToPlay.css';

class HowToPlay extends React.Component {
	render() {
		return (
			<div className="m-howToPlay">
				<h2>What is this?</h2>
				<p>This is a prototype for the night gameplay in Up There They Love, made using React.</p> 
				<p>You play as the Captain and you are looking have a good time with your Crew Member. Your goal is to fill the Crew Member's Arousal bar at the top of the screen. At the same time, they're trying to fill yours. The best outcome is for both bars to be filled at the same time.</p>
				<p>You can affect the bars by playing a card from your hand against the one on the table. Cards can affect both of your Arousal bars.</p>
				<p>Note that you always play two cards at the end of each round: the one that was on the table previously and the one that was just put down.</p>
				<p>If the connection type from the previous card matches the type of your card, you will increase the streak. The higher the streak, the more points you will earn for each card being played.</p>
				<h2>How to play</h2>
				<ul>
					<li>Press "Start game" to start playing</li>
					<li>Click on a card from your hand to place it on the table</li>
					<li>Press "End Turn" to end your turn and apply the card to the game</li>
					<li>Select a card that the Crew Member will play</li>
					<li>Keep playing until the bars fill up</li>
				</ul>
			</div>
		);
	}
}

export default HowToPlay;