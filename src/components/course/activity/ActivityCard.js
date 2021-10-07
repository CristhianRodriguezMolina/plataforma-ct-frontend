import React, { useState } from 'react'

// SCSS
import './ActivityCard.scss';

// COMPONENTS

// Link 
import { withRouter } from 'react-router-dom';

// Material UI Core
import { Tooltip } from '@material-ui/core';

// Modal de confirmación
import AlertModal from '../../common/AlertModal';

// Iconos
import { AccountTree, BorderVertical, Ballot, Delete, Edit } from '@material-ui/icons';

// Alert
import { Alert } from '@material-ui/lab';
// API
import api from '../../../services/api';

//Sortable Element
import { SortableElement } from 'react-sortable-hoc';


const ActivityCard = SortableElement((props) => {

	const { activity, task, setActivities, setIsAddingActivities } = props;


	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	// Funcion para mostrar una alerta de error dado un mensaje
	const showError = (message) => {
		setError(true);   //Se cambia el estado de mensaje de error a verdadero
		setErrorMessage(message); //Se setea el mensaje de error
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setError(false);
			setErrorMessage("");
		}, 2000)
	}

	// Funcion para mostrar una alerta satisfactoria dado un mensaje
	const showSuccess = (message) => {
		setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setSuccess(false);
			setSuccessMessage("");
		}, 2000)
	}

	const deleteActivity = () => {

		//Delete an activity from list
		api.delete(`/api/course/task/activity/${task._id}/${activity._id}`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				setIsAddingActivities(true);
				showSuccess(res.data.message);
				// Eliminacion del estudiante de la lista de estudiantes del curso
				setActivities(prevValues => {
					return prevValues.filter(value => value !== activity)
				});
				setIsAddingActivities(false);
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
				}
			})
	}

	const redirectToEdit = () => {
		if (activity.type === 'logic_sequence') {
			props.history.push(`/activity/logic-sequence/${activity._id}`)
		} else if (activity.type === 'maze') {
			props.history.push(`/activity/maze/${activity._id}`)
		} else if (activity.type === 'questionnaire') {
			props.history.push(`/activity/questionnaire/${activity._id}`)
		} else {
			showError('Error desconocido con la actividad')
		}
	}

	return (
		<div className="activity-card-container">
			{success ?
				<Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
				: ""
			}
			{process ?
				<Alert className="alert-message logic-sequence-alert" severity="info">{processMessage}</Alert>
				: ""
			}
			<div className="activity-card">
				{
					activity.type.localeCompare("logic_sequence") === 0 ?
						<AccountTree fontSize="large" className="activity-icon" /> : activity.type.localeCompare("maze") === 0 ?
							<BorderVertical fontSize="large" className="activity-icon" /> : <Ballot fontSize="large" className="activity-icon" />
				}
				<div className="ml-2">
					{activity.name}
					<br />
					<h6 className='text-muted mt-1'>{activity.description}</h6>
				</div>
			</div>
			<div className="buttons-container">
				<div className="icon-buttons btn-group-vertical">
					<Tooltip title="Editar" aria-label="edit">
						<button onClick={() => redirectToEdit()} className="custom-btn custom-btn-primary mb-2 p-2 d-flex justify-content-center align-items-center" data-toggle="modal" data-target="#userDetail"><Edit /></button>
					</Tooltip>
					<Tooltip title="Borrar" aria-label="delete">
						<button onClick={() => setOpen(!open)} className="custom-btn custom-btn-delete p-2" data-toggle="modal" data-target="#deleteUser"><Delete /></button>
					</Tooltip>
				</div>
				<div className="group-buttons btn-group-vertical">
					<button onClick={() => redirectToEdit()} className="custom-btn custom-btn-primary mb-2 p-2 d-flex justify-content-center align-items-center w-100" data-toggle="modal" data-target="#userDetail">Editar</button>
					<button onClick={() => setOpen(!open)} className="custom-btn custom-btn-delete p-2" data-toggle="modal" data-target="#deleteUser">Borrar</button>
				</div>
			</div>
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Está seguro que quiere borrar esta actividad de la tarea?'
				action={deleteActivity}
			/>
		</div >
	)
});


export default withRouter(ActivityCard);