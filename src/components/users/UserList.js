import React, { useState, useEffect, Suspense } from 'react'

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
import { useLocation } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';

export default function UserList({ type, filterText }) {

	let location = useLocation();

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Users of the platform (Teacher or Students)
	const [users, setUsers] = useState(null)

	// Usuarios filtrados
	const [filteredUsers, setFilteredUsers] = useState(users);

	// Actual type of the view (teacher or student)
	const [actualType, setActualType] = useState(type);

	// Variable to manage the current page of the students list
	const [page, setPage] = useState(1);

	// Variable to set the number of pages there ir gonna be
	const [numPages, setNumPages] = useState(5);

	// Max number of students in one page
	const maxUsers = 5;

	useEffect(() => {
		if (!users || actualType !== type) {
			setSuccess(false);
			setUsers(null);
			setFilteredUsers(null);
			setActualType(type);
			setPage(1);
			fetchUsers();
		}
	}, [location]);

	useEffect(() => {
		if (filterText !== '') {
			setFilteredUsers(users.filter(({ first_name, last_name, phone, id }) => (
				first_name.toLowerCase().includes(filterText.toLowerCase()) ||
				last_name.toLowerCase().includes(filterText.toLowerCase()) ||
				phone.includes(filterText) ||
				id.includes(filterText)
			)));
		} else {
			setFilteredUsers(users);
			setPage(1); // This line is for, when you clean the search input then put the page in 1
		}
	}, [filterText]);

	// UseEffect to manage the current number of pages
	useEffect(() => {
		if (filteredUsers) {
			const newNumPages = Math.ceil(filteredUsers.length / maxUsers);

			// The number of pages is according with the number of students that are been shown 
			setNumPages(newNumPages);

			// If the current page is deleted cause a student is deleted then the current page is setted to the last
			if (page > newNumPages) {
				setPage(newNumPages);
			}
		}
	}, [filteredUsers])

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
				// Asignacion de los cursos de la base de datos
				setUsers(users);
				setFilteredUsers(users);

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
			if (error.response) {
				showError(error.response.message);
				console.log(`Ha ocurrido un error: ${error}`);
			} else {
				showError(`Un error ha ocurrido obteniendo los usuarios ${error}`);
				console.log(`Ha ocurrido un error: ${error}`);
			}
		}
		setProcess(false);
		setProcessMessage('');
	}

	// Method to handle the change of the page
	const handleChangePage = (evt, page) => {
		setPage(page);
	}

	return (
		<div className="mt-4">
			{success ?
				<Alert className="alert-message" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="alert-message" severity="error">{errorMessage}</Alert>
				: ""
			}
			{process ?
				<Alert severity="info">{processMessage}</Alert>
				: ""
			}
			<div>
				{
					filteredUsers && filteredUsers.length > 0 ?
						<>
							{/* USES A SLICE TO JUST RENDER THE USERS IN THE CURRENT PAGE */}
							{
								filteredUsers.slice((page - 1) * maxUsers, ((page - 1) * maxUsers) + maxUsers).map(user => (
									<div key={user._id}>
										<UserCard user={user} setUsers={setUsers} type={type} />
									</div>
								))
							}
							{
								filteredUsers.length > maxUsers ?
									<div className='d-flex justify-content-center mt-4'>
										<Pagination count={numPages} onChange={handleChangePage} page={page} color="primary" />
									</div>
									:
									''
							}
						</>
						:
						<h3 className="there-is-no-users">No hay {type === "teachers" ? "profesores" : "alumnos"} para mostrar</h3>
				}
			</div>
		</div>
	)
}


