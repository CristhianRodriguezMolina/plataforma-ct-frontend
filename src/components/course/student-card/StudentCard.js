import React, { useState } from 'react'

// API
import api from '../../../services/api';

// Util
import * as util from '../../../util/util';

// SCSS
import './StudentCard.scss';

// COMPONENTS

// Animation
import { Animated } from "react-animated-css";

// Avatar
import Avatar from '@material-ui/core/Avatar';

import Typography from '@material-ui/core/Typography';

// Modal de confirmacion de borrado
import AlertModal from '../../common/AlertModal';

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

// Link
import { Link } from 'react-router-dom'

// Icons
import { Delete, Edit, Cached } from '@material-ui/icons'

// Alert
import { Alert } from '@material-ui/lab';

export default function StudentCard(props) {

	// Datos que llegan por parametros del componente
	const { index, student, course, setStudents, setIsAddingStudents, type } = props;

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	// Visibility for the components animation
	const [visible, setVisible] = useState(true);

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

	const deleteStundentFromCourse = async () => {
		// Toggle for the animation of the component
		setVisible(false);
		try {
			setProcess(true);
			setProcessMessage('Borrando usuario...');

			const response = await api.delete(`/api/course/students/${course._id}/${student._id}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			setIsAddingStudents(true);
			const { message } = response.data;

			showSuccess(message);

			// Eliminacion del estudiante de la lista de estudiantes del curso
			setStudents(prevValues => {
				console.log(prevValues);
				// if (prevValues.length === 1) {
				// 	return null;
				// }
				return prevValues.filter(value => value !== student)
			});
		} catch (error) {
			if (error.response) {
				showError('Error inesperado en el servidor');
				console.log(error.response.data.message);
			} else {
				showError('Error inesperado en el servidor');
				console.log(`Ha ocurrido un error: ${error}`);
			}
		}
		// Toggle for the animation of the component
		setVisible(false);
		setProcess(false);
		setProcessMessage('');
		setIsAddingStudents(false);
	}

	return (
		<Animated animationIn="rubberBand" animationInDuration={1000} animationOut="bounceOutRight" animationOutDuration={1000} isVisible={visible}>
			<div id={student._id} className="course-user">
				<div className="student-course-card">
					<b>{index + 1}</b>
					<Avatar className="student-avatar mr-2" src="https://picsum.photos/200/300" />
					<div className="mr-auto">
						<Typography component="h1">
							{student.first_name} {student.last_name}
							<br />
							<p className="text-muted d-inline">ID: {student.id}</p>
							<br />
							<p className="text-muted d-inline">Edad: {util.getAge(student.birth_date)}</p>
						</Typography>
					</div>
					{success ?
						<Alert severity="success">{successMessage}</Alert>
						: ""
					}
					{error ?
						<Alert severity="error">{errorMessage}</Alert>
						: ""
					}
					{process ?
						<Alert severity="info">{processMessage}</Alert>
						: ""
					}
					<Typography variant="subtitle1">
						<div className="btn-group-sm btn-group-vertical">
							<Tooltip title="Borrar del curso" aria-label="delete">
								<button onClick={() => setOpen(!open)} className="btn btn-danger"><Delete /></button>
							</Tooltip>
							<Tooltip title="Editar" aria-label="edit">
								<Link to={`/user/students/edit/${student._id}`} className="btn btn-info"><Edit /></Link>
							</Tooltip>
							<Tooltip title="Progreso" aria-label="progress">
								<Link to="progress" className="btn btn-success"><Cached /></Link>
							</Tooltip>
						</div>
					</Typography>
					<AlertModal
						type="delete"
						open={open}
						handleClose={() => setOpen(!open)}
						message='¿Esta seguro que quiere quitar este estudiante del curso?'
						action={deleteStundentFromCourse}
					/>
				</div>
			</div>
		</Animated>
	)
}
