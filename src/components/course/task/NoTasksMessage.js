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
			<h1>Sin Tareas...</h1>
			<p>Al parecer estas de suerte porque aquí no hay nada que hacer</p>
		</div>
	)
};

export default NoTasksMessage;

