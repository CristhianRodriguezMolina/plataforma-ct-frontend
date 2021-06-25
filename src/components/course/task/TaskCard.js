import React, { useEffect, useRef, useState } from 'react';

import './TaskCard.scss';

// WithRouter
import { withRouter } from 'react-router-dom';

// Link
import Link from 'react-router-dom/Link';

// Iconos
import { Delete, Edit } from '@material-ui/icons';

// Modal de confirmacion de borrado
import AlertModal from '../../common/AlertModal';

const TaskCard = props => {
	const [taskActivities, setTaskActivities] = useState(null);
	const [disableButton, setDisableButton] = useState(false);

	const stateList = []

	useEffect(() => {
		if (props.taskActivities) {

			if (!taskActivities) {
				let tempActivities = props.taskActivities.filter((taskActivity) => taskActivity.task === props.task._id);
				setTaskActivities(tempActivities);
			}
		}
	}, [props.taskActivities]);

	useEffect(() => {
		if (props.studentActivities && taskActivities) {
			let disableBtn = true;
			for (let i = 0; i < taskActivities.length && disableBtn; i++) {
				let nextActivity = props.studentActivities.filter(studentActivity => studentActivity.activity === taskActivities[i].activity);

				//if the studentActivity exists
				if (nextActivity.length > 0) {
					if (!nextActivity[0].complete) {
						disableBtn = false;
					}
				}
				else {
					disableBtn = false;
				}
			}

			if (disableBtn) {
				setDisableButton(disableBtn);
			}

		}
	}, [props.studentActivities, props.taskActivities]);

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	const items = [];

	const handleRedirectToActivity = (taskActivity) => {
		if (props.forStudent) {
			props.history.push(`/activity/logic-sequence/student/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivity.activity}`);
		} else {
			props.history.push(`/activity/logic-sequence/${taskActivity.activity}`);
		}
	};

	if (taskActivities) {
		for (let i = 0; i < taskActivities.length; i++) {
			var studentActivity;
			if (props.forStudent && props.studentActivities) {
				studentActivity = props.studentActivities.filter((studentActivity) => studentActivity.activity === taskActivities[i].activity)[0];
			}
			items.push(
				<div key={i} className="activity-item" onClick={() => handleRedirectToActivity(taskActivities[i])}>
					<h4>{i + 1}</h4>
					{studentActivity ?
						<div className={`activity-task-view ${studentActivity.complete ? 'active' : ''}`}></div> :
						props.forStudent ?
							<div className="activity-task-view"></div> :
							<div className="activity-task-view active"></div>}

				</div >
			);
		}
	}


	const handleDeleteTask = () => {
		props.onDeleteTask(props.task._id);
	};

	const handleDoActivities = () => {

		if (taskActivities) {
			//Search the first incomplete activity
			for (let i = 0; i < taskActivities.length; i++) {
				let nextActivity = props.studentActivities.filter(studentActivity => studentActivity.activity === taskActivities[i].activity);

				//if the studentActivity exists
				if (nextActivity.length > 0) {
					if (!nextActivity[0].complete) {
						props.history.push(`/activity/logic-sequence/student/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivities[i].activity}`);
						return;
					}
				}
				else {
					props.history.push(`/activity/logic-sequence/student/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivities[i].activity}`);
					return;
				}
			}
		}
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
			{
				!props.forStudent ?
					<>
						<Link to={`/course/edit/${props.courseId}/units-info/${props.unitId}/${props.task._id}`} className="custom-btn custom-btn-primary edit-button"><Edit /></Link>
						<button className="custom-btn custom-btn-delete delete-button" onClick={() => setOpen(!open)}><Delete /> </button>
						<AlertModal
							type="delete"
							open={open}
							handleClose={() => setOpen(!open)}
							message='¿Esta seguro que quiere borrar esta tarea de la unidad?'
							action={handleDeleteTask}
						/>
					</>
					:
					!disableButton ?
						<button onClick={() => handleDoActivities()} className="custom-btn custom-btn-success do-button px-2">Realizar</button> :
						<button className="custom-btn custom-btn-success do-button px-2 disable-button" disabled={true}>Realizado</button>
			}
		</div >
	)
};
export default withRouter(TaskCard);