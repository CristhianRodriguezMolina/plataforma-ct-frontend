import React, { useEffect, useContext, useState } from 'react'
import { useParams, Redirect } from "react-router-dom";

// SCSS
import './UnitContent.scss';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// API
import api from '../../../services/api';

// COMPONENTS

// Title card
import TitleCard from '../../common/TitleCard';

// Material UI components (Core)
import { Container, Typography, Button } from '@material-ui/core';

// Alert
import { Alert } from '@material-ui/lab'



// Activity card
import ActivityCard from '../activity/ActivityCard';

export default function ManageTask() {

	// Variables del cotexto
	const { changeColor } = useContext(UserContext);

	// Vars in the url
	const { courseId, unitId, taskId } = useParams();

	// Data of the task
	const [taskName, setTaskName] = useState("Task name");
	const [taskDescription, setTaskDescription] = useState("Task description");
	const [task, setTask] = useState(null);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	const [loading, setLoading] = useState(true);


	// Funcion para mostrar una alerta de error dado un mensaje
	const showError = (message) => {
		setError(true);   //Se cambia el estado de mensaje de error a verdadero
		setErrorMessage(message); //Se setea el mensaje de error
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setError(false);
			setErrorMessage("");
		}, 2000)
	};

	// Funcion para mostrar una alerta satisfactoria dado un mensaje
	const showSuccess = (message) => {
		setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setSuccess(false);
			setSuccessMessage("");
		}, 2000)
	};

	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	};

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#dcedc8');
	});

	useEffect(() => {
		const fetch = () => {
			api.get(`/api/course/task/${courseId}/${unitId}/${taskId}`, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					let taskTemp = res.data.task;
					setTask(taskTemp);
					setTaskName(taskTemp.name);
					setTaskDescription(taskTemp.description);
					setLoading(false);
				})
				.catch(err => {
					setLoading(false);
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
					}
				});
		}

		if (!task) {
			fetch();
		}
	}, [task]);

	const handleSubmit = (e) => {
		e.preventDefault();
		api.put(`/api/course/task/${courseId}/${unitId}/${taskId}`, {
			name: taskName,
			description: taskDescription
		}, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				showSuccess(res.data.message);
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
				}
			})
	}

	return (
		<div>
			{!loading ?
				task ?
					<div>
						{success ?
							<Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
							: ""
						}
						{error ?
							<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
							: ""
						}
						{process ?
							<Alert className="alert-message logic-sequence-alert" severity="info">{processMessage}</Alert>
							: ""
						}
						<TitleCard
							title="My Course"
							color="#B6E768"
						/>
						<Container className="task-manage-container" maxWidth="sm">
							<div>
								<Typography><b>Unidad 1 | {taskName}</b></Typography>
							</div>
							<hr />
							<div>
								<Typography variant="subtitle1" className="text-center">Información de la tarea</Typography>
								<form onSubmit={evt => handleSubmit(evt)}>
									<div className="form-group">
										<label className="form-label">Nombre</label>
										<input className="form-control shadow" type="text" onChange={evt => setTaskName(evt.target.value)} value={taskName} label="Nombre de la tarea" name="taskname" required />
									</div>
									<div className="form-group">
										<label className="form-label">Descripcion</label>
										<textarea className="form-control shadow" rows="3" onChange={evt => setTaskDescription(evt.target.value)} value={taskDescription} label="Descripcion de la tarea" name="taskdescription" required />
									</div>
									<div className="form-group d-flex justify-content-start">
										<button type="submit" className="btn btn-info btn-create-user shadow mt-4">Guardar cambios</button>
									</div>
								</form>
							</div>
							<hr />
							<div>
								<Typography variant="subtitle1" className="text-center">Actividades</Typography>
								<div className="activities-container">
									<ActivityCard
										activity={{
											name: 'Secuencia mamalona',
											description: 'Descripción mamalona',
											type: 'logic_sequence'
										}}
									/>
									<ActivityCard
										activity={{
											name: 'Laberinto del fauno',
											description: 'Descripción del fauno',
											type: 'maze'
										}}
									/>
									<ActivityCard
										activity={{
											name: 'ICFES',
											description: 'Descripción',
											type: 'questionnaire'
										}}
									/>
									<ActivityCard
										activity={{
											name: 'Laberinto del fauno',
											description: 'Descripción del fauno',
											type: 'maze'
										}}
									/>
									<ActivityCard
										activity={{
											name: 'ICFES',
											description: 'Descripción',
											type: 'questionnaire'
										}}
									/>
									<ActivityCard
										activity={{
											name: 'Laberinto del fauno',
											description: 'Descripción del fauno',
											type: 'maze'
										}}
									/>
									<ActivityCard
										activity={{
											name: 'ICFES',
											description: 'Descripción',
											type: 'questionnaire'
										}}
									/>
								</div>
								<Button variant="contained" className="btn btn-success btn-add-activities">Agregar actividades</Button>
							</div>
						</Container>
					</div>
					:
					<Redirect to="/unauthorized" />
				: ""}
		</div>
	)
}
