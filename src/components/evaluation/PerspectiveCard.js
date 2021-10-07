import React, { useContext, useEffect, useRef, useState } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './PerspectivesView.scss';

// Util
import * as util from '../../util/util';

// COMPONENTS

// Material-UI core
import { IconButton, Tooltip } from '@material-ui/core';

// Icons
import { Edit, Delete } from '@material-ui/icons';

// Alert modal
import AlertModal from '../common/AlertModal';
import { Alert } from '@material-ui/lab';

const PerspectiveCard = (props) => {

	// Datos del contexto de usuario
	const { isAdmin, isTeacher } = useContext(UserContext);

	// The variables in the props
	const { perspective, setPerspectives } = props;

	// Toggle of the modal to delete the perspective card
	const [open, setOpen] = useState(false);

	// Toggle of the editing state of the perspective card
	const [editing, setEditing] = useState(false);

	//
	const [messageToUpdate, setMessageToUpdate] = useState(perspective.message)

	// Reference of the update button
	const updateBtn = useRef(null);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
	const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio


	useEffect(() => {
		setMessageToUpdate(perspective.message);
	}, [editing])

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

	// Method to delete the perspective
	const deletePerspective = async () => {
		try {
			setInfo(true);
			setInfoMessage('Borrando perspectiva...')

			const response = await api.delete(`/api/perspective/${perspective._id}`, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			});

			const { message } = response.data;

			if (message) {
				if (setPerspectives) {
					setPerspectives(prevValue => {
						return prevValue.filter(value => value !== perspective);
					});
				}

				showSuccess(message);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
			} else {
				showError('Ha ocurrido un error inesperado');
			}
		}

		setInfo(false);
		setInfoMessage('')
	}

	// Method to update the perspective message
	const updatePerspective = async () => {
		try {
			updateBtn.current.disabled = true; // This is to avoid problems if the user press the button multiple times

			setInfo(true);
			setInfoMessage('Actualizando perspectiva...')

			const response = await api.put(`/api/perspective/${perspective._id}`, {
				message: messageToUpdate
			}, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			});

			const { updatedPerspective, message } = response.data;

			if (message) {
				// Updating the perspective for the frontend
				perspective.message = updatedPerspective.message;
				perspective.updatedAt = updatedPerspective.updatedAt;

				showSuccess(message);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
			} else {
				showError('Ha ocurrido un error inesperado');
			}
		}
		updateBtn.current.disabled = false;
		setEditing(false);
		setInfo(false);
		setInfoMessage('')
	}

	// Method to cancel the editing 
	const cancelEditing = () => {
		setEditing(false)
		setMessageToUpdate(perspective.message); // This is to reset the message to update if the user writes something but no make a update
	}

	return (
		<div className='perspective-card-container'>
			{/* ACTION BUTTONS */}
			{
				(isAdmin || isTeacher) && !editing ?
					<div className='delete-button'>
						<Tooltip title="Editar" aria-label="edit">
							<IconButton className="m-0 p-0 mr-2" color="primary" aria-label="Delete" onClick={() => setEditing(true)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip title="Borrar" aria-label="delete">
							<IconButton className="m-0 p-0" color="secondary" aria-label="Delete" onClick={() => setOpen(!open)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</div>
					: ''
			}

			{/* DATA */}
			<h4 className='title'>{perspective.course.name}</h4>
			<h5 className='subtitle text-muted'>{perspective.course.description}</h5>
			{
				!editing ?
					<p className='message'>{perspective.message}</p>
					:
					<textarea className='message form-control' type="text" rows="6" label="Perspective" name="Perspectiva" placeholder='Escribe tu perspectiva aquí' onChange={(event) => setMessageToUpdate(event.target.value)} value={messageToUpdate} />
			}
			<h4 className='teacher'><span className='text-muted'>Por el profesor: </span>{perspective.teacher.first_name} {perspective.teacher.last_name}</h4>
			{
				(isAdmin || isTeacher) && perspective.student.first_name ?
					<h4 className='teacher'><span className='text-muted'>Para el estudiante: </span>{perspective.student.first_name} {perspective.student.last_name}</h4>
					: ''
			}
			<h5 className='date text-muted'>{util.getCustomDate(perspective.createdAt)}</h5>
			{
				perspective.createdAt !== perspective.updatedAt ?
					<h5 className='date text-muted'>Modificada: {util.getCustomDate(perspective.updatedAt)}</h5>
					: ''
			}

			{/* BUTTONS TO UPDATE THE PERSPECTIVE */}
			{
				editing ?
					<>
						<hr />
						<div className="editing-perspective-buttons">
							<button onClick={updatePerspective} ref={updateBtn} className='custom-btn custom-btn-primary p-2 mr-2' color="secondary" variant="contained">Actualizar</button>
							<button onClick={cancelEditing} className='custom-btn p-2'>Cancelar</button>
						</div>
					</>
					: ''
			}

			{/* MODAL TO DELETE THE PERSPECTIVE */}
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Está seguro que quiere borrar esta perspectiva?'
				action={deletePerspective}
			/>

			{/* MESSAGES */}
			{success ?
				<Alert className="" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="" severity="error">{errorMessage}</Alert>
				: ""
			}
			{info ?
				<Alert className="" severity="info">{infoMessage}</Alert>
				: ""
			}
		</div>
	)
}

export default PerspectiveCard
