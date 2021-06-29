import React, { useEffect, useState } from 'react'

// API
import api from '../../services/api';

// SCSS
import './profile.scss'

// COMPONENTS

// Material UI core
import { Breadcrumbs, Typography } from '@material-ui/core';

// Link
import { Link } from 'react-router-dom';

// Alert
import { Alert } from '@material-ui/lab';

// WithRouter
import { withRouter } from 'react-router-dom';

function ChangePassword(props) {

	// Variables que llegan por los props del componente
	const { history, user } = props;

	const [currentPassword, setCurrentPassword] = useState('') //Contraseña actual del usuario
	const [newPassword, setNewPassword] = useState(''); //Contraseña nueva del usuario
	const [confirm_new_password, setConfirmNewPassword] = useState(''); //Comfirmación de contraseña nueva del usuario

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Funcion para mostrar una alerta de error dado un mensaje
	const showError = (error) => {
		setError(true);   //Se cambia el estado de mensaje de error a verdadero
		setErrorMessage(error); //Se setea el mensaje de error
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

	// Metodo para actualizar los datos de sesion de un usuario (Password)
	const updatePassword = async (e) => {
		e.preventDefault();

		try {
			if (currentPassword !== "" && newPassword !== "" && confirm_new_password !== "") { //Se verifica la existencia de todos los campos del formulario

				setProcess(true);
				setProcessMessage("Actualizando usuario...");

				const response = await api.put(`/api/person/change-password/${user._id}`, { //Peticion post a la api para crear un usuario nuevo 
					id: user.id,
					currentPassword,
					password: newPassword,                      		//  PARAMETROS
					confirm_password: confirm_new_password             	//  DE LA PETICION
				}, {
					headers: {
						'x-access-token': localStorage.getItem('token')
					}
				});

				const { updatedUser, message } = response.data;

				if (updatedUser) { //Se verifica si existe      
					setNewPassword('');
					setConfirmNewPassword(''); // SE LIMPIAN LOS VALORES DEL FORMULARIO
					setCurrentPassword('');

					showSuccess(message);
				}
			} else {
				showError("Debes llenar todos los campos");
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
				console.log(error.response.data.message);
			} else {
				showError('Error inesperado en el servidor');
				console.log(`Error inesperado en el servidor`);
			}
		}
		setProcess(false);
		setProcessMessage('');
	}

	return (
		<div className='profile-data-content'>
			<Breadcrumbs>
				<Link className='text-muted' to='overview'>Mi perfil</Link>
				<Typography><b>Cambiar contraseña</b></Typography>
			</Breadcrumbs>
			<form onSubmit={evt => updatePassword(evt)} className="mt-4">
				<h1 className="h5 mb-3">Cambiar contraseña</h1>
				<div className="form-group">
					<label>Contraseña actual</label>
					<input className="form-control" type="password" minLength="4" onChange={evt => setCurrentPassword(evt.target.value)} value={currentPassword} label="Contrasena actual" name="contrasena_actual" required />
				</div>
				<div className="form-group">
					<label>Contraseña</label>
					<input className="form-control" type="password" minLength="4" onChange={evt => setNewPassword(evt.target.value)} value={newPassword} label="Contrasena" name="contrasena" required />
				</div>
				<div className="form-group">
					<label>Confirmar contraseña</label>
					<input className="form-control" type="password" onChange={evt => setConfirmNewPassword(evt.target.value)} value={confirm_new_password} label="Confirmar contrasena" name="confirmar_contrasena" required />
				</div>
				<div className="form-group d-flex justify-content-end mt-4">
					<button className="custom-btn custom-btn-primary btn-create-user px-2 py-2">Establecer nueva contraseña</button>
				</div>
			</form>
			{success ?
				<Alert className="alert-message" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="alert-message" severity="error">{errorMessage}</Alert>
				: ""
			}
			{process ?
				<Alert className="alert-message" severity="info">{processMessage}</Alert>
				: ""
			}
		</div>
	)
}

export default withRouter(ChangePassword);