//React
import React, { useState, useEffect } from 'react';

//SCSS
import './NoTasksMessage.scss';

//Icon
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

const NoTasksMessage = (props) => {
	return (
		<div className='no-tasks-message-container'>
			<InsertEmoticonIcon style={{ fontSize: 80, color: '#96BAFF' }}/>
			<h1>{props.messageTitle}</h1>
			<p>{props.messageDes}</p>
		</div>
	)
};

export default NoTasksMessage;

