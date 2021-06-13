import React, { useState } from 'react'

// API
import api from '../../services/api';

// SCSS
import './user.scss';

// Util
import * as util from '../../util/util';

// COMPONENTS

// Avatar
import Avatar from '@material-ui/core/Avatar';

// Alerta
import Alert from '@material-ui/lab/Alert';

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

// Link
import Link from 'react-router-dom/Link';

// Iconos
import { Delete, Edit } from '@material-ui/icons';

export default function UserCard({ user, setUsers, history, type }) {

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
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

	const deleteUser = async () => {
		try {
			setProcess(true);
			setProcessMessage('Borrando usuario...');

			const response = await api.delete(`/api/person/${user._id}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const { deletedUser, message } = response.data;

			if (deletedUser) {
				setProcess(false);
				setProcessMessage('');

				showSuccess(message);

				// Asignacion de los cursos de la base de datos                
				setUsers(prevValues => {
					return prevValues.filter(value => value !== user)
				});

			} else if (message) {
				showError(message);
			} else {
				showError('Error inesperado en el servidor');
			}
		} catch (error) {
			showError('Error inesperado en el servidor');
			console.log(`Ha ocurrido un error: ${error}`);
		}
	}

	return (
		<div className="user-card d-flex justify-content-between mb-4">
			<div className="card d-flex justify-content-center align-items-left mr-3">
				<div className="d-flex align-items-center px-4">
					<Avatar className="mr-2" src="https://i.pinimg.com/originals/32/a3/69/32a3690fe66a73adcb98922874eb8b8a.jpg" />
					<div className="ml-2 mr-5">
						<p className="m-0">{user.first_name} {user.last_name}</p>
						<p className="m-0 text-muted">ID: {user.id}</p>
						<p className="m-0 text-muted">Edad: {util.getAge(user.birth_date)} años</p>
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
				</div>
			</div>
			<div className="d-flex flex-column">
				<div className="icon-buttons button-group btn-group-vertical">
					<Tooltip title="Editar" aria-label="edit">
						<Link to={`/user/${type}/edit/${user._id}`} className="btn btn-primary d-flex justify-content-center align-items-center" data-toggle="modal" data-target="#userDetail"><Edit /></Link>
					</Tooltip>
					<Tooltip title="Borrar" aria-label="delete">
						<button onClick={deleteUser} className="btn btn-danger" data-toggle="modal" data-target="#deleteUser"><Delete /></button>
					</Tooltip>
				</div>
				<div className="group-buttons button-group btn-group-vertical">
					<Link to={`/user/${type}/edit/${user._id}`} className="btn btn-primary d-flex justify-content-center align-items-center" data-toggle="modal" data-target="#userDetail">Editar</Link>
					<button onClick={deleteUser} className="btn btn-danger" data-toggle="modal" data-target="#deleteUser">Borrar</button>
				</div>
			</div>
		</div>
	)
}
