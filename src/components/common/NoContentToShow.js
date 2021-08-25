//React
import React, { useState, useEffect } from 'react';

//SCSS
import './NoContentToShow.scss';

//Icons
import { Mood, MoodBad, Face } from '@material-ui/icons';

const NoContentToShow = (props) => {
	return (
		<div className='no-tasks-message-container'>
			{
				props.icon === 'mood' ?
					<Mood style={props.color ? { fontSize: 80, color: props.color } : { fontSize: 80, color: '#96BAFF' }} />
					:
					props.icon === 'mood_bad' ?
						<MoodBad style={props.color ? { fontSize: 80, color: props.color } : { fontSize: 80, color: '#ef9a9a' }} />
						:
						props.icon === 'face' ?
							<Face style={props.color ? { fontSize: 80, color: props.color } : { fontSize: 80, color: '#b39ddb' }} />
							:
							''
			}
			<h1>{props.messageTitle}</h1>
			<p>{props.messageDes}</p>
		</div>
	)
};

export default NoContentToShow;

