import React, { useEffect, useState } from 'react'

// API
import api from '../../services/api';

// SCSS
import './profile.scss'

// Date formater
import dateFormat from 'dateformat';

// COMPONENTS

// Material UI core
import { Breadcrumbs, Typography } from '@material-ui/core';

// Link
import { Link } from 'react-router-dom';

// Alert
import { Alert } from '@material-ui/lab';

// WithRouter
import { withRouter } from 'react-router-dom';

function EditProfile(props) {

	// Variables que llegan por los props del componente
	const { history, user, setIsChangingData, setUser } = props;

	const [first_name, setFirstName] = useState(''); //Primer nombre del usuario
	const [last_name, setLastName] = useState(''); //Apellido del usuario
	const [birth_date, setBirthDate] = useState(''); //Edad del usuario
	const [genre, setGenre] = useState('NA'); //Genero del usuario
	const [id, setId] = useState(''); //Id del usuario
	const [phone, setPhone] = useState(''); //Telefono del usuario
	const [email, setEmail] = useState(''); //Email del usuario
	const [achievements, setAchievements] = useState(''); //Logros del usuario

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	useEffect(() => {
		if (user) {
			setBirthDate(user.birth_date);
			setId(user.id);
			setGenre(user.genre);
			setFirstName(user.first_name);
			setLastName(user.last_name);
			setPhone(user.phone);
			setEmail(user.email);
			setAchievements(user.achievements);
			console.log(user.achievements)
		}
	}, [user])

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

	// Metodo para crear o actualizar los datos basicos de un usuario (Nombre, apellido, fecha de nacimiento, genero, id)
	const updateUser = async (e) => {
		e.preventDefault();

		try {
			if (id !== "" && first_name !== "" && last_name !== ""  //Se verifica la existencia de todos los campos del formulario
				&& birth_date !== Date.now && genre !== "") {

				setProcess(true);
				setProcessMessage("Actualizando datos...");

				let response = await api.put(`/api/person/${user._id}`, { //Peticion post a la api para crear un usuario nuevo                               
					id,                         //  PARAMETROS
					first_name,                 //  DE 
					last_name,                  //  LA PETICION
					birth_date,                	//
					genre,                      //
					phone,
					email,
					achievements
				}, {
					headers: {
						'x-access-token': localStorage.getItem('token')
					}
				});

				const { updatedUser, message } = response.data;

				if (updatedUser) { //Se verifica si existe

					// Se actualizan los datos del localstorage despues de actualizar el usuario en la base de datos
					localStorage.setItem('user_name', updatedUser.first_name);
					localStorage.setItem('user_last_name', updatedUser.last_name);
					localStorage.setItem('user_id', updatedUser._id);

					setUser(updatedUser) // SE MODIFICA EL USUARIO EN EL FRONTEND DEL PROFILE

					setIsChangingData(true); // Se activa el flag para que se haga un fetch del usuario nuevamente

					showSuccess(message);

					history.push('edit-profile'); // Se redirige a la misma pagina en la que se encuentra el usuario para que se actualice los datos de la navegacion
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
				console.log(`Ha ocurrido un error: ${error}`);
			}
		}
		setProcess(false);
		setProcessMessage('');
	}

	return (
		<div className='profile-data-content'>
			<Breadcrumbs>
				<Link className='text-muted' to='overview'>Mi perfil</Link>
				<Typography><b>Editar mi perfil</b></Typography>
			</Breadcrumbs>
			<form onSubmit={evt => updateUser(evt)} className="mt-4">
				<h1 className="h5 mb-3">Editar datos de perfil</h1>
				<div className="form-group">
					<label className="form-label">Nombres</label>
					<input className="form-control" type="text" onChange={evt => setFirstName(evt.target.value)} value={first_name} label="Nombre" name="nombres" required />
				</div>
				<div className="form-group">
					<label>Apellidos</label>
					<input className="form-control" type="text" onChange={evt => setLastName(evt.target.value)} value={last_name} label="Apellidos" name="apellidos" required />
				</div>
				<div className="form-group">
					<label>Edad</label>
					<input className="form-control" type="date" min="1950-01-01" max={dateFormat(new Date(), 'yyyy-mm-dd')} onChange={evt => setBirthDate(new Date(evt.target.value))} value={dateFormat(birth_date, 'GMT:yyyy-mm-dd')} label="Fecha de cumpleaños" name="fechadecumpleaños" required />
				</div>
				<div className="form-group">
					<label>Genero</label>
					<select className="form-control" onChange={evt => setGenre(evt.target.value)} value={genre} aria-label="Default select example" required>
						<option value="NA" selected disabled>Selecciona un genero</option>
						<option value="F">Femenino</option>
						<option value="M">Masculino</option>
						<option value="NB">No binario</option>
					</select>
				</div>
				<div className="form-group">
					<label>ID</label>
					<input className="form-control" type="number" onChange={evt => setId(evt.target.value)} value={id} label="ID" name="id" required />
				</div>
				<div className="form-group">
					<label>Teléfono</label>
					<input className="form-control" type="number" onChange={evt => setPhone(evt.target.value)} value={phone} label="Telefono" name="telefono" />
				</div>
				<div className="form-group">
					<label>Email</label>
					<input className="form-control" type="text" onChange={evt => setEmail(evt.target.value)} value={email} label="Email" name="email" />
				</div>
				<div className="form-group">
					<label>Logros</label>
					<textarea className="form-control" type="text" rows="4" onChange={evt => setAchievements(evt.target.value)} value={achievements} label="Logros" name="logros" />
				</div>
				<div className="form-group d-flex justify-content-end mt-4">
					<button type='submit' className="custom-btn custom-btn-primary btn-create-user px-2 py-2">Guardar datos</button>
				</div>
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
			</form>
		</div>
	)
}

export default withRouter(EditProfile);