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

// Material UI Core
import { Modal, Fade, Avatar, Typography, Backdrop } from '@material-ui/core';

// Modal de confirmacion de borrado
import AlertModal from '../../common/AlertModal';

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

// Link
import { Link } from 'react-router-dom'

// Icons
import { Delete, Edit, Cached, Info } from '@material-ui/icons'

// Alert
import { Alert } from '@material-ui/lab';

export default function StudentCard(props) {

	// Datos que llegan por parametros del componente
	const { index, student, course, setStudents, setIsAddingStudents, forStudent } = props;

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	// Variable de estado para el modal de datos del estudiante
	const [openInfo, setOpenInfo] = useState(false);

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
		<Animated animationIn="fadeIn" animationInDuration={100} animationOut="bounceOutRight" animationOutDuration={1000} isVisible={visible}>
			<div id={student._id} className="course-user">
				<div className="student-course-card">
					<b>{index + 1}</b>
					<Avatar className="student-avatar mr-2" src="https://picsum.photos/200/300" />
					<div className="mr-auto">
						<Typography component="h1">
							{student.first_name} {student.last_name}
							<br />
							<p className="text-muted d-inline">Género: {student.genre}</p>
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
					{
						forStudent ?
							<>
								<Typography variant="subtitle1">
									<div className="btn-group-sm btn-group-vertical">
										<Tooltip title={<p className='text-center m-0 p-0'>Información< br />del< br />compañero</p>} aria-label="info">
											<button onClick={() => setOpenInfo(!openInfo)} className="custom-btn custom-btn-info btn-user-card"><Info /></button>
										</Tooltip>
									</div>
								</Typography>
							</>
							:
							<>
								<Typography variant="subtitle1">
									<div className="d-flex">
										<div className="btn-group-sm btn-group-vertical">
											<Tooltip title="Borrar del curso" aria-label="delete">
												<button onClick={() => setOpen(!open)} className="custom-btn custom-btn-delete btn-user-card mb-2"><Delete /></button>
											</Tooltip>
											<Tooltip title="Editar" aria-label="edit">
												<Link to={`/user/students/edit/${student._id}`} className="custom-btn custom-btn-primary btn-user-card"><Edit /></Link>
											</Tooltip>
										</div>
										<div className="btn-group-sm btn-group-vertical ml-2">
											<Tooltip title={<p className='text-center m-0 p-0'>Información< br />del< br />estudiante</p>} aria-label="info">
												<button onClick={() => setOpenInfo(!openInfo)} className="custom-btn custom-btn-info btn-user-card mb-2"><Info /></button>
											</Tooltip>
											<Tooltip title="Progreso" aria-label="progress">
												<Link to={`progress-info`} className="custom-btn custom-btn-success btn-user-card"><Cached /></Link>
											</Tooltip>
										</div>
									</div>
								</Typography>
								<AlertModal
									type="delete"
									open={open}
									handleClose={() => setOpen(!open)}
									message='¿Esta seguro que quiere quitar este estudiante del curso?'
									action={deleteStundentFromCourse}
								/>
							</>
					}
					<Modal
						aria-labelledby="transition-modal-title"
						aria-describedby="transition-modal-description"
						className='d-flex justify-content-center align-items-center'
						open={openInfo}
						onClose={() => setOpenInfo(!openInfo)}
						closeAfterTransition
						BackdropComponent={Backdrop}
						BackdropProps={{
							timeout: 500,
						}}
					>
						<Fade in={openInfo}>
							<div className='modal-student-info'>
								<Typography variant='h4' className='mb-4'>{student.genre !== 'M' ? 'Información del compañero' : 'Información de la compañera'}</Typography>
								<div className="d-flex justify-content-center align-items-center">
									<Avatar className="modal-student-avatar mr-2" src="https://picsum.photos/200/300" />
									<div>
										<p className='m-0 ml-4 mb-2 p-0 text-white'><b>{student.first_name} {student.last_name}</b></p>
										{
											forStudent ?
												''
												:
												<p className='m-0 ml-4 mb-2 p-0'>Identificación: {student.id !== '' ? <b>{student.id}</b> : <b>No tiene Identificación :(</b>}</p>
										}
										<p className='m-0 ml-4 mb-2 p-0'>{forStudent ? "Cumpleaños" : "Fecha de nacimiento"}: <b>{util.getSpanishDate(student.birth_date)}</b></p>
										<p className='m-0 ml-4 mb-2 p-0'>Edad: <b>{util.getAge(student.birth_date)}</b></p>
										<p className='m-0 ml-4 mb-2 p-0'>Genero: {student.genre !== 'M' ? <b>Masculino</b> : <b>Femenino</b>}</p>
									</div>
								</div>
							</div>
						</Fade>
					</Modal>
				</div>
			</div>
		</Animated>
	)
}
