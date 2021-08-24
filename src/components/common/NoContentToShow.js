//React
import React, { useState, useEffect } from 'react';

//SCSS
import './NoContentToShow.scss';

//Icons
import { Mood, MoodBad } from '@material-ui/icons';

const NoContentToShow = (props) => {
	return (
		<div className='no-tasks-message-container'>
			{
				props.icon === 'mood' ?
					<Mood style={{ fontSize: 80, color: '#96BAFF' }} />
					:
					props.icon === 'mood_bad' ?
						<MoodBad style={{ fontSize: 80, color: '#ef9a9a' }} />
						:
						''
			}
			<h1>{props.messageTitle}</h1>
			<p>{props.messageDes}</p>
		</div>
	)
};

export default NoContentToShow;

