import React, { useState, useEffect } from 'react';

// SCSS
import './studentview.scss';

// API
import api from '../../../services/api';

// WithRouter
import { withRouter } from 'react-router-dom';

// COMPONENTS

import DynamicInput from '../../common/DynamicInput';

import TaskCard from '../task/TaskCard';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Activities icons
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BallotIcon from '@material-ui/icons/Ballot';
import BorderVerticalIcon from '@material-ui/icons/BorderVertical';

// Button
import Button from '@material-ui/core/Button';

// Modal de confirmacion de borrado
import AlertModal from '../../common/AlertModal';

import PropTypes from 'prop-types';

import AddBoxIcon from '@material-ui/icons/AddBox';

//CheckCircleIcon
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

//NoContentToShow
import NoContentToShow from '../../common/NoContentToShow';

//Progress Bar
import ProgressBar from '../../common/ProgressBar';

const UnitContent = props => {

	const [isCompletedUnit, setCompletedUnit] = useState(false);

	// save the information to show the continue the last task
	const [lastActivityInfo, setLastActivityInfo] = useState(null);

	//show a message if the current unit has no task to show
	const [foundTasks, setFoundTasks] = useState(true);

	const [completedPercentage, setCompletedPercentage] = useState(null);

	// Variable to see if the info data is loading
	const [isLoadingLasActivity, setIsLoadingLasActivity] = useState(true);

	const nameInputStyle = {
		width: "100%",
		fontSize: "1.7em",
		margin: "0",
		padding: "0.4em 0.3em",
		lineHeight: "1.2em",
		fontWeight: "600"
	};

	const desInputStyle = {
		width: "100%",
		fontSize: "0.8em",
		margin: "0",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em"
	};

	useEffect(() => {

		if (props.taskActivities && props.studentActivities && props.unitValue) {
			if (props.unitValue.tasks.length > 0) {
				let taskActivities = props.taskActivities.filter(taskActivity => taskActivity.unit === props.unitValue._id);

				let completedActivities = props.studentActivities.filter(studentActivity => studentActivity.unit === props.unitValue._id && studentActivity.complete == true);
				setCompletedPercentage(Math.round((completedActivities.length / taskActivities.length) * 100));

				let disableBtn = true;
				for (let i = 0; i < taskActivities.length && disableBtn; i++) {
					//find if the student is linked to the especific activity
					let nextActivity = props.studentActivities.filter(studentActivity => studentActivity.activity === taskActivities[i].activity && studentActivity.task === taskActivities[i].task);

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
					setCompletedUnit(disableBtn);
				}

			} else {
				setFoundTasks(false);
			}
		}
	});

	useEffect(() => {
		const fetchLastActivityInfo = async () => {
			if (!isCompletedUnit) {
				if (!lastActivityInfo) {
					try {
						const res = await api.get(`/api/course/students/last-activity/${localStorage.getItem('user_id')}/${props.course._id}/${props.unitValue._id}`, {
							headers: {
								'x-access-token': localStorage.getItem('token')
							}
						});
						if (res) {
							if (res.data.success) {
								setLastActivityInfo(res.data.lastActivityInfo);
							}
						}
					} catch (e) {
						console.log(e);
					}
					setIsLoadingLasActivity(false);
				}
			}
		}
		fetchLastActivityInfo();
	}, [isCompletedUnit]);

	const redirectToActivity = () => {
		if (lastActivityInfo) {
			props.history.push(`/activity/student/${localStorage.getItem("user_id")}/${props.course._id}/${props.unitValue._id}/${lastActivityInfo.taskId}/${lastActivityInfo.activityId}`);
		}
	}

	return (
		<div className="unit-content-container">
			<div className="unit-content-info mb-4">
				<h1 className="h4 mb-4 mx-2">{props.unitValue.name}</h1>
				<h1 className="h6 mx-2">{props.unitValue.description}</h1>
			</div>
			{props.unitValue.is_due_date ?
				<h3 className="h6 mx-3"><b>Hasta:</b> {props.unitValue.due_date.substring(0, 10)}</h3> :
				<h3 className="h6 mx-3">Fecha limite de la unidad: Sin fecha limite</h3>}
			<hr className="mx-3" />
			{!isCompletedUnit && completedPercentage && completedPercentage > 0 ?
				<ProgressBar hasTitle={true} title={'Progreso:'} bgColor={'#ffb16e'} percentage={completedPercentage} />
				: ''}
			{isCompletedUnit ?
				<div className="completed-unit-message">
					<div className="success-icon-container">
						<CheckCircleIcon className="success-icon" />
					</div>
					<h2>¡Completada!</h2>
					<hr />
					<p>¡Felicitaciones!
						Has completado todas las actividades de esta unidad
					</p>
				</div>
				:

				!isLoadingLasActivity ?
					lastActivityInfo ?
						<>
							<div className="quick-access-container">
								<h1 className="quick-access-label">Acceso rápido</h1>

								<div className="last-activity-container">
									<div className="task-info">
										<h2>{lastActivityInfo.taskName}</h2>
										<p>{lastActivityInfo.taskDes}</p>
									</div>

									<div className='last-activity-info'>
										<div className='activity-icon'>
											{lastActivityInfo.activityType === 'logic_sequence' ?
												<AccountTreeIcon style={{ fontSize: 50 }} /> :

												lastActivityInfo.activityType === 'maze' ?
													<BorderVerticalIcon style={{ fontSize: 50 }} /> :
													<BallotIcon style={{ fontSize: 50 }} />
											}
										</div>

										<h3><span style={{ color: '#aaa' }}>Nombre: </span>{lastActivityInfo.activityName}</h3>
										<p className='activity-des-label'><span style={{ color: '#aaa' }}>Descripción: </span>{lastActivityInfo.activityDes}</p>
										<p className='activity-pos-label'><span style={{ color: '#aaa' }}>Número: </span>{(lastActivityInfo.activityPos + 1)}</p>

										<div className='do-activity-button-container'>
											<button className="custom-btn custom-btn-success px-2 py-1" onClick={() => redirectToActivity()}>Realizar actividad</button>
										</div>
									</div>
								</div>
							</div>
							<hr className="mx-3" />
						</>
						: ""
					:
					<div style={{ height: '10em', width: '100%', position: 'relative' }}>
						<div className="spinner-loading">
							<div className="spinner-border" role="status">
								<span className="sr-only">Loading...</span>
							</div>
						</div>
					</div>
			}


			<h1 className="h5 text-center mb-4">Actividades</h1>

			{!foundTasks ?
				<NoContentToShow icon='face' messageTitle={'Sin tareas...'} messageDes={'Al parecer estas de suerte porque aquí no hay nada que hacer'} />
				: ""}

			{props.taskActivities ?
				<div className="cards-container">
					{props.unitValue.tasks.map((task, i) => (
						task.visible ?
							<TaskCard
								key={i}
								forStudent={true}
								studentActivities={props.studentActivities ? props.studentActivities.filter(studentActivity => studentActivity.task === task._id) : null}
								taskActivities={props.taskActivities ? props.taskActivities.filter(taskActivity => taskActivity.task === task._id) : null}
								courseId={props.course._id}
								unitId={props.unitValue._id}
								task={task} />
							:
							''
					))}
				</div>
				: ""}

		</div >
	)
};

UnitContent.propTypes = {
	unitValue: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string,
		visible: PropTypes.bool
	}),
	onUpdateChanges: PropTypes.func
}

export default withRouter(UnitContent);
