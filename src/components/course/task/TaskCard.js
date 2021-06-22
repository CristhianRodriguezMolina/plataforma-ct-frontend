import React, { useEffect, useRef, useState } from 'react';

import './TaskCard.scss';

// Link
import Link from 'react-router-dom/Link';

// Iconos
import { Delete, Edit } from '@material-ui/icons';

// Modal de confirmacion de borrado
import AlertModal from '../../common/AlertModal';

const TaskCard = props => {
	const [activityNumber, setActivityNumber] = useState(0);
	const [taskActivities, setTaskActivities] = useState(null);

	const stateList = []

	useEffect(() => {
		if (props.activities) {
			if (!taskActivities) {
				let tempActivities = props.activities.filter((activity) => activity.task === props.task._id);
				const data = tempActivities.map((value) => {
					const election = Math.random() > 0.5
					return { ...value, state: election }
				});
				setTaskActivities(data);
				setActivityNumber(tempActivities.length);
			}
		}
	}, [props.activities]);

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	const items = [];

	const handleRedirectToActivity = (activity) => {
		console.log('activity');
		console.log(activity)
	};

	for (let i = 0; i < activityNumber; i++) {
		items.push(
			<div key={i} className="activity-item" onClick={() => handleRedirectToActivity(taskActivities[i])}>
				<h4>{i + 1}</h4>
				<div className={`activity-task-view ${taskActivities[i].state ? 'active' : ''}`}></div>
			</div>
		);
	}

	const handleDeleteTask = () => {
		props.onDeleteTask(props.task._id);
	};

	return (
		<div className='task-card-container'>
			<div onClick={props.onPress} className="task-card">
				<div className="activities-container">
					<h2>{props.task.name}</h2>
					<div className="activities-visualization">
						{items.length > 0 ? items : <p className="no-activities-label">No hay actividades</p>}
					</div>
				</div>
				<div className="progress-visualization">
					<h3><b>Progreso:</b> 9/12</h3>
					<h3><b>Hasta:</b> 12/06/2021</h3>
				</div>
			</div>
			<Link to={`/course/edit/${props.courseId}/units-info/${props.unitId}/${props.task._id}`} className="btn btn-primary edit-button"><Edit /></Link>
			<button className="btn btn-danger delete-button" onClick={() => setOpen(!open)}><Delete /> </button>
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Esta seguro que quiere borrar esta unidad del curso?'
				action={handleDeleteTask}
			/>
		</div >
	)
};
export default TaskCard;