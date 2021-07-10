import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// Date formater
import dateFormat from 'dateformat';

// SCSS
import './user.scss';

// COMPONENTS

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Contenedor
import { Container, Breadcrumbs, Typography } from '@material-ui/core';

// Link
import { Link } from 'react-router-dom';

// Alert
import Alert from '@material-ui/lab/Alert';

export default function CreateUser({ history }) {

	// Datos del contexto
	const { changeColor } = useContext(UserContext);

	// Datos que vienen como parametros en la ruta para este componente
	const { type, action, ID } = useParams();

	const [first_name, setFirstName] = useState(''); //Primer nombre del usuario
	const [last_name, setLastName] = useState(''); //Apellido del usuario
	const [birth_date, setBirthDate] = useState(''); //Edad del usuario
	const [genre, setGenre] = useState('NA'); //Genero del usuario
	const [id, setId] = useState(''); //Id del usuario
	const [password, setPassword] = useState(''); //Contraseña del usuario
	const [confirm_password, setConfirmPassword] = useState(''); //Comfirmación de contraseña del usuario

	// Usuario en caso de que se vaya a editar
	const [user, setUser] = useState(null);



	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		if (type === "teachers") {
			changeColor('#ffe0b2');
		} else if (type === "students") {
			changeColor('#bbdefb');
		}
	}, [type]);

	useEffect(() => {
		if (ID) { // En caso de que llegue una ID de usuario por la ruta            
			fetchUser();
		}
		if (action !== "create" && action !== "edit") {
			history.push('/unauthorized');
		}
		if (type !== "teachers" && type !== "students") {
			history.push('/unauthorized');
		}
	}, [type])

	// Funcion para mostrar una alerta de error dado un mensaje
	const showError = (error) => {
		setError(true);   //Se cambia el estado de mensaje de error a verdadero
		setErrorMessage(error); //Se setea el mensaje de error
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setError(false);
			setErrorMessage("");
		}, 2000)
	}

	// METODO PARA OBTENER LOS DATOS DE UN USUARIO EN DADO CASO DE QUE SE VAYA A EDITAR CON LA ID QUE LLEGA POR LA RUTA
	const fetchUser = async () => {
		try {
			setProcess(true);
			setProcessMessage("Obteniendo datos usuario...");

			const response = await api.get(`/api/person/${ID}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const { user, message } = response.data;

			if (user) {
				setBirthDate(user.birth_date);
				setId(user.id);
				setGenre(user.genre);
				setFirstName(user.first_name);
				setLastName(user.last_name);
				setPassword('');
				setConfirmPassword('');

				setUser(user);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
				console.log(error.response.data.message);
			} else {
				showError('Error inesperado en el servidor');
				console.log(`Ha ocurrido un error: ${error}`);
			}
			history.push('/unauthorized');
		}
		setProcess(false);
		setProcessMessage('');
	}

	// Metodo para crear o actualizar los datos basicos de un usuario (Nombre, apellido, fecha de nacimiento, genero, id)
	const createUser = async (e) => {
		e.preventDefault();

		try {
			if ((password !== "" && confirm_password !== "") || action === "edit") {
				if (id !== "" && first_name !== "" && last_name !== ""  //Se verifica la existencia de todos los campos del formulario
					&& birth_date !== Date.now && genre !== "") {

					setProcess(true);
					setProcessMessage("Creando usuario...");

					//Role seleccionados para el usuario
					let role = null;
					if (type === "teachers") { role = "teacher" } else { role = "student" }

					let response = null;

					if (action === "create") {
						response = await api.post('/api/person', { //Peticion post a la api para crear un usuario nuevo
							id,                         //
							password,                   //   
							confirm_password,           //  PARAMETROS 
							first_name,                 //  DE
							last_name,                  //  LA PETICION
							birth_date,                 //
							genre,                      //
							role
						}, {
							headers: {
								'x-access-token': localStorage.getItem('token')
							}
						});
					} else {
						response = await api.put(`/api/person/${user._id}`, { //Peticion post a la api para crear un usuario nuevo                               
							id,                         //  PARAMETROS
							first_name,                 //  DE 
							last_name,                  //  LA PETICION
							birth_date,                        //
							genre,                      //
							role
						}, {
							headers: {
								'x-access-token': localStorage.getItem('token')
							}
						});
					}

					const { savedUser, updatedUser, message } = response.data;

					if (savedUser || updatedUser) { //Se verifica si existe                 
						setBirthDate(Date.now);
						setId('');
						setGenre('');
						setPassword('');
						setConfirmPassword(''); // SE LIMPIAN LOS VALORES DEL FORMULARIO
						setFirstName('');
						setLastName('');

						history.goBack();
					}
				} else {
					showError("Debes llenar todos los campos");
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

	// Metodo para actualizar los datos de sesion de un usuario (Password)
	const updateSesionData = async (e) => {
		e.preventDefault();

		try {
			if (id === "") {
				showError("Debes proporcionar un ID para poder modificar el usuario");
			} else if (password !== "" && confirm_password !== "") { //Se verifica la existencia de todos los campos del formulario

				setProcess(true);
				setProcessMessage("Actualizando usuario...");

				const response = await api.put(`/api/person/session/${user._id}`, { //Peticion post a la api para crear un usuario nuevo 
					id,
					password,                         //  PARAMETROS
					confirm_password                 //  DE LA PETICION
				}, {
					headers: {
						'x-access-token': localStorage.getItem('token')
					}
				});

				const { updatedUser, message } = response.data;

				if (updatedUser) { //Se verifica si existe                 
					setBirthDate(Date.now());
					setId('');
					setGenre('');
					setPassword('');
					setConfirmPassword(''); // SE LIMPIAN LOS VALORES DEL FORMULARIO
					setFirstName('');
					setLastName('');

					history.goBack();
				} else {
					showError(message);
				}

				setProcess(false);
				setProcessMessage('');
			} else {
				showError("Debes llenar todos los campos");
			}
		} catch (error) {
			showError('Error inesperado en el servidor');
			console.log(`Ha ocurrido un error: ${error}`);
		}
		setProcess(false);
		setProcessMessage('');
	}

	return (
		<div>
			<TitleCard
				title={type === "teachers" ? "Gestión de profesores" : "Gestion de alumnos"}
				color={type === "teachers" ? "#FFA552" : "#3C8AFF"}
				colorFont='#fff'
			/>
			<Container className="form-create-user-container mt-4" maxWidth="sm">
				<Breadcrumbs>
					<Link className='text-muted' onClick={() => history.goBack()}>Lista de {type === "teachers" ? "profesores" : "alumnos"}</Link>
					<Typography><b>Editar {type === "teachers" ? "profesor" : "alumno"}</b></Typography>
				</Breadcrumbs>
				<form onSubmit={evt => createUser(evt)} className="form-create-user">
					<h1 className="h5">{action === "create" ? "Crear" : "Actualizar"} {type === "teachers" ? "profesor" : "alumno"}</h1>
					<hr />
					<p className=""><b>Datos personales</b></p>
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
						<input
							className="form-control"
							type="date"
							min="1950-01-01"
							max={dateFormat(new Date(), 'yyyy-mm-dd')}
							onChange={evt => setBirthDate(new Date(evt.target.value))}
							value={dateFormat(birth_date, 'GMT:yyyy-mm-dd')}
							label="Fecha de cumpleaños" name="fechadecumpleaños"
							required />
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
					{
						action === "create" ?
							<>
								<hr />
								<p className=""><b>Datos de sesión</b></p>
								<div className="form-group">
									<label>Contraseña</label>
									<input className="form-control" type="password" minLength="4" onChange={evt => setPassword(evt.target.value)} value={password} label="Contrasena" name="contrasena" required />
								</div>
								<div className="form-group">
									<label>Confirmar contraseña</label>
									<input className="form-control" type="password" onChange={evt => setConfirmPassword(evt.target.value)} value={confirm_password} label="Confirmar contrasena" name="confirmar_contrasena" required />
								</div>
							</>
							:
							""

					}
					{error ?
						<Alert className="alert-message" severity="error">{errorMessage}</Alert>
						: ""
					}
					{process ?
						<Alert className="alert-message" severity="info">{processMessage}</Alert>
						: ""
					}
					<div className="form-group d-flex justify-content-center">
						<button className={type === "teachers" ? "custom-btn custom-btn-danger btn-create-user px-2" : "custom-btn custom-btn-primary btn-create-user px-2"}>{action === "create" ? "Crear" : "Actualizar datos basicos"}</button>
					</div>
				</form>
				{
					action === "edit" ?
						<form onSubmit={evt => updateSesionData(evt)} className="form-create-user">
							<hr />
							<p className=""><b>Datos de sesión</b></p>
							<div className="form-group">
								<label>Contraseña</label>
								<input className="form-control" type="password" minLength="4" onChange={evt => setPassword(evt.target.value)} value={password} label="Contrasena" name="contrasena" required />
							</div>
							<div className="form-group">
								<label>Confirmar contraseña</label>
								<input className="form-control" type="password" onChange={evt => setConfirmPassword(evt.target.value)} value={confirm_password} label="Confirmar contrasena" name="confirmar_contrasena" required />
							</div>
							<div className="form-group d-flex justify-content-center">
								<button className={type === "teachers" ? "custom-btn custom-btn-danger btn-create-user px-2" : "custom-btn custom-btn-primary btn-create-user px-2 mb-5"}>Actualizar datos de sesión</button>
							</div>
						</form>
						:
						""
				}
			</Container>
		</div >
	)
}
