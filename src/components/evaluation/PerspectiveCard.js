import React, { useContext, useEffect, useState } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// SCSS
import './PerspectivesView.scss';

// Util
import * as util from '../../util/util';

// Material-UI core
import { IconButton, Tooltip } from '@material-ui/core';

// Icons
import { Edit, Delete } from '@material-ui/icons';

const PerspectiveCard = (props) => {

	// Datos del contexto de usuario
	const { isAdmin, isTeacher } = useContext(UserContext);

	// The variables in the props
	const { perspective } = props;

	// Toggle of the modal to delete the perspective card
	const [open, setOpen] = useState(false);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
	const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

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

	const deletePerspective = () => {
		try {

		} catch (error) {
			if (error.response) {
				showError(error.response.message);
			} else {
				showError('Ha ocurrido un error inesperado');
			}
		}
	}

	return (
		<div className='perspective-card-container'>
			{
				isAdmin || isTeacher ?
					<div className='delete-button'>
						<Tooltip title="Editar" aria-label="edit">
							<IconButton className="m-0 p-0 mr-2" color="primary" aria-label="Delete" onClick={deletePerspective}>
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
			<h4 className='title'>{perspective.course_name}</h4>
			<h5 className='subtitle text-muted'>{perspective.course_description}</h5>
			<p className='message'>{perspective.message}</p>
			<h4 className='teacher'><span className='text-muted'>Por el profesor: </span>{perspective.teacher_name}</h4>
			<h5 className='date text-muted'>{util.getCustomDate(perspective.createdAt)}</h5>
		</div>
	)
}

export default PerspectiveCard
