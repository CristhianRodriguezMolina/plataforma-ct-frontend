import React, { useEffect, useRef, useState } from 'react';

// API
import api from '../../../services/api';

// SCSS
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
	const [completedActivitiesNumber, setCompletedActivitiesNumber] = useState(0);

	useEffect(() => {
		if (props.taskActivities) {

			if (!taskActivities) {
				let tempActivities = props.taskActivities.filter((taskActivity) => taskActivity.task === props.task._id);
				tempActivities.sort((a, b) => {
					return a.position - b.position;
				});
				setTaskActivities(tempActivities);
			}
		}
	}, [props.taskActivities]);

	useEffect(() => {
		if (props.studentActivities && taskActivities) {
			let disableBtn = true;
			let completedNumber = 0;
			for (let i = 0; i < taskActivities.length; i++) {
				//find if the student is linked to the especific activity
				let nextActivity = props.studentActivities.filter(studentActivity => studentActivity.activity === taskActivities[i].activity);

				//if the studentActivity exists
				if (nextActivity.length > 0) {

					if (!nextActivity[0].complete) {
						disableBtn = false;
					}
					else {
						//Count the number of the completed activities
						completedNumber++;
					}
				}
				else {
					disableBtn = false;
				}
			}

			if (disableBtn) {
				setDisableButton(disableBtn);
			}

			setCompletedActivitiesNumber(completedNumber);

		}
	});

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	const items = [];

	const handleRedirectToActivity = async (taskActivity) => {
		if (props.forStudent) {

			props.history.push(`/activity/student/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivity.activity}`);
		} else {
			props.history.push(`/activity/teacher/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivity.activity}`);
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
						props.history.push(`/activity/student/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivities[i].activity}`);
						return;
					}
				}
				else {
					props.history.push(`/activity/student/${props.courseId}/${props.unitId}/${props.task._id}/${taskActivities[i].activity}`);
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
				{props.forStudent ?
					taskActivities ?
						<div className="progress-visualization">
							<h3><b>Progreso:</b> {completedActivitiesNumber}/{taskActivities.length}</h3>
							{props.task.is_due_date ?
								<h3><b>Hasta:</b> {props.task.due_date.substring(0, 10)}</h3> :
								<h3><b>Hasta:</b> Sin fecha limite</h3>}
						</div> : ""
					:
					<div className="progress-visualization">
						{props.task.is_due_date ?
							<h3><b>Hasta:</b> {props.task.due_date.substring(0, 10)}</h3> :
							<h3><b>Hasta:</b> Sin fecha limite</h3>}
					</div>}
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
