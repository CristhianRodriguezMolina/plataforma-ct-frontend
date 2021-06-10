import React, { useState, useEffect } from 'react'

// API
import api from '../../services/api';

// SCSS
import './user.scss';

// COMPONENTS

// Alerta
import Alert from '@material-ui/lab/Alert';

// Tarjeta de usuario
import UserCard from './UserCard';

// Link and withRouter
import { Link, useLocation } from 'react-router-dom';

export default function UserList({ type }) {

	let location = useLocation();

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	const [users, setUsers] = useState(null)

	useEffect(() => {
		fetchUsers();
	}, [location]);

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

	const fetchUsers = async () => {
		try {
			setProcess(true);
			setProcessMessage('Obteniendo personas...');

			let response = null;

			if (type === "teachers") {
				response = await api.get("/api/person/role/teacher", { headers: { 'x-access-token': localStorage.getItem('token') } });
			} else if (type === "students") {
				response = await api.get("/api/person/role/student", { headers: { 'x-access-token': localStorage.getItem('token') } });
			}

			const { users, message } = response.data;

			if (users) {
				setProcess(false);
				setProcessMessage('');

				// Asignacion de los cursos de la base de datos
				setUsers(users);

				if (users.length > 0) {
					showSuccess(message);
				}
			} else if (message) {
				setProcess(false);
				setProcessMessage('');
				showError(message);
			} else {
				setProcess(false);
				setProcessMessage('');
				showError('Error inesperado en el servidor');
			}
		} catch (error) {
			setProcess(false);
			setProcessMessage('');
			showError(`Un error ha ocurrido obteniendo los usuarios ${error}`);
			console.log(`Ha ocurrido un error: ${error}`);
		}
	}

	return (
		<div className="mt-4">
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
			<div>
				{
					users && users.length > 0 ?
						(
							users.map(user => (
								<UserCard key={user._id} user={user} setUsers={setUsers} type={type} />
							))
						)
						:
						(
							<div>
								<h3 className="there-is-no-users">Aún no hay {type === "teachers" ? "profesores" : "alumnos"}</h3>
							</div>
						)
				}
			</div>
		</div>
	)
}


