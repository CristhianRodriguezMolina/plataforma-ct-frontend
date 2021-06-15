import React from 'react';

import './TaskCard.scss';

// Link
import Link from 'react-router-dom/Link';

// Iconos
import { Delete, Edit } from '@material-ui/icons';

const TaskCard = props => {
	const activityNumber = Math.floor((Math.random() * 50) + 1);

	const items = []

	for (let i = 0; i < activityNumber; i++) {
		items.push(
			<div key={i} className="activity-item">
				<h4>{i + 1}</h4>
				<input type="radio"></input>
			</div>
		);
	}
	return (
		<div className='task-card-container'>
			<div onClick={props.onPress}>
				<div className="activities-container">
					<h2>Contenedor de actividades</h2>
					<div className="activities-visualization">
						{items}
					</div>
				</div>
				<div className="progress-visualization">
					<h3><b>Progreso:</b> 9/12</h3>
					<h3><b>Hasta:</b> 12/06/2021</h3>
				</div>
			</div>
			<Link to='/' className="btn btn-primary edit-button" data-toggle="modal" data-target="#userDetail"><Edit /></Link>
			<button className="btn btn-danger delete-button" data-toggle="modal" data-target="#deleteUser"><Delete /></button>
		</div>
	)
};
export default TaskCard;