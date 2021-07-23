import React, { useState, useEffect } from 'react';

// SCSS
import './studentview.scss';

// API
import api from '../../../services/api';

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

const UnitContent = props => {

	const [isCompletedUnit, setCompletedUnit] = useState(false);

	// save the information to show the continue the last task
	const [lastActivityInfo, setLastActivityInfo] = useState(null);

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
			let taskActivities = props.taskActivities.filter(taskActivity => taskActivity.unit === props.unitValue._id);
			let disableBtn = true;
			for (let i = 0; i < taskActivities.length && disableBtn; i++) {
				//find if the student is linked to the especific activity
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
				setCompletedUnit(disableBtn);
			}
		}
	});

	useEffect(async () => {
		if(!isCompletedUnit) {
			if(!lastActivityInfo) {
				try {
					const res = await api.get(`/api/course/students/last-activity/${localStorage.getItem('user_id')}/${props.course._id}/${props.unitValue._id}`, {
						headers: {
							'x-access-token': localStorage.getItem('token')
						}
					});
					if(res) {
						if(res.data.success) {
							setLastActivityInfo(res.data.lastActivityInfo);
						}
					}
				} catch (e) {
					console.log(e);
				}
			}
		}
	}, [isCompletedUnit]);	

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
				lastActivityInfo ?
				<div className="quick-access-container">
					<h1 className="quick-access-label">Acceso rápido</h1>
					<div className="last-activity-container">
						<div className="task-info">
							<h2>{ lastActivityInfo.taskName }</h2>
							<p>{ lastActivityInfo.taskDes }</p>
						</div>
						<div className='last-activity-info'>
							<div className='activity-icon'>
								<AccountTreeIcon style={{ fontSize: 50 }}/>
							</div>
							<h3><span style={{color: '#aaa'}}>Nombre: </span>{ lastActivityInfo.activityName }</h3>
							<p className='activity-des-label'><span style={{color: '#aaa'}}>Descriptión: </span>{ lastActivityInfo.activityDes }</p>
							<p className='activity-pos-label'><span style={{color: '#aaa'}}>Número: </span>{ (lastActivityInfo.activityPos + 1) }</p>
							<div className='do-activity-button-container'>
								<button className="custom-btn custom-btn-success px-2 py-1">Realizar actividad</button>
							</div>
						</div>
					</div>
				</div>
				:""
			}

			<hr className="mx-3" />
			<h1 className="h5 text-center mb-4">Actividades</h1>
			{props.taskActivities ?
				<div className="cards-container">
					{props.unitValue.tasks.map((task, i) => (
						task.visible ?
							<TaskCard
								key={i}
								forStudent={true}
								studentActivities={props.studentActivities}
								taskActivities={props.taskActivities}
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

export default UnitContent;
