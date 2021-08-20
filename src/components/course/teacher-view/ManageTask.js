import React, { useEffect, useContext, useState } from 'react'
import { useParams, Redirect } from "react-router-dom";

// SCSS
import './UnitContent.scss';
import './ManageTask.scss';

// Date formater
import dateFormat from 'dateformat';

//Array move
import arrayMove from 'array-move';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// API
import api from '../../../services/api';

// COMPONENTS

// Link
import { Link } from 'react-router-dom';

// Title card
import TitleCard from '../../common/TitleCard';

// Material UI components (Core)
import { Container, Typography, Switch, FormControlLabel, Breadcrumbs } from '@material-ui/core';

// Alert
import { Alert } from '@material-ui/lab'

//ActivitiesPopup for add activities to the task
import ActivitiesPopup from './ActivitiesPopup';

// Activity card
import ActivityCard from '../activity/ActivityCard';

import { SortableContainer } from 'react-sortable-hoc';

const SortableList = SortableContainer(({ items, setIsAddingActivities, setActivities, task }) => {

	return (
		<div>
			{items.map((activity, index) => (
				<ActivityCard
					key={`item-${index}`}
					index={index}
					activity={activity}
					setIsAddingActivities={setIsAddingActivities}
					setActivities={setActivities}
					task={task} />
			))}
		</div>
	);
});

export default function ManageTask() {

	// Variables del cotexto
	const { changeColor } = useContext(UserContext);

	// Vars in the url
	const { courseId, unitId, taskId } = useParams();

	// Data of the task
	const [taskName, setTaskName] = useState("Task name");
	const [taskDescription, setTaskDescription] = useState("Task description");
	const [task, setTask] = useState(null);

	//Activities
	const [activities, setActivities] = useState(null);

	// Variables para controlar la apertura y cierre del modal de estudiantes
	const [isAddingActivities, setIsAddingActivities] = useState(false)
	const [isOpen, setIsOpen] = useState(false);
	const toggle = () => setIsOpen(!isOpen);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	//Wait for api fetching
	const [loading, setLoading] = useState(true);

	//Task visibility
	const [visible, setVisible] = useState(false);

	//Limit date to do a task
	const [dueDate, setDueDate] = useState(null);

	//To define and enable due date input
	const [isDueDate, setIsDueDate] = useState(false);


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

	const handleVisible = () => {
		setVisible(!visible);
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
					setVisible(taskTemp.visible);
					setIsDueDate(taskTemp.is_due_date);
					if (taskTemp.is_due_date) {
						setDueDate(taskTemp.due_date);
					}
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
		};


		if (!task) {
			fetch();
		}
	}, [task]);

	const fecthActivities = () => {
		api.get(`/api/course/tasks/${taskId}`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				if (res.data) {
					setActivities(res.data.activities);
				}
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
				}
			});
	};

	useEffect(() => {
		if (!activities || isAddingActivities) {
			fecthActivities();
		}
	}, [activities, isAddingActivities])

	const handleSubmit = (e) => {
		e.preventDefault();
		api.put(`/api/course/task/${courseId}/${unitId}/${taskId}`, {
			name: taskName,
			description: taskDescription,
			visible: visible,
			due_date: dueDate,
			is_due_date: isDueDate
		}, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				showSuccess(res.data.message);

				api.put(`/api/course/task/activity/${taskId}`, {
					activities
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
					});
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
				}
			});


	}

	const onSortEnd = ({ oldIndex, newIndex }) => {

		let arrayCopy = [...activities];
		arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
		setActivities(arrayCopy);
	};

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
							title={taskName}
							color="#B6E768"
						/>
						<Container className="task-manage-container" maxWidth="sm">
							<div className="mt-4">
								<Breadcrumbs>
									<Link className='text-muted' to={`/course/edit/${courseId}/units-info`}>Unidades</Link>
									<Typography><b>{taskName}</b></Typography>
								</Breadcrumbs>
							</div>
							<hr />
							<div>
								<Typography variant="subtitle1" className="text-center">Información de la tarea</Typography>
								<form onSubmit={evt => handleSubmit(evt)}>
									<div className="form-group">
										<label className="form-label">Nombre</label>
										<input
											className="form-control"
											type="text"
											onChange={evt => setTaskName(evt.target.value)}
											value={taskName}
											label="Nombre de la tarea"
											name="taskname"
											required />
									</div>
									<div className="form-group">
										<label className="form-label">Descripcion</label>
										<textarea
											className="form-control"
											rows="3"
											onChange={evt => setTaskDescription(evt.target.value)}
											value={taskDescription} label="Descripcion de la tarea"
											name="taskdescription"
											required />
									</div>
									<FormControlLabel className="switcher" labelPlacement="start" label="Definir fecha limite" control={
										<Switch
											checked={isDueDate}
											onChange={() => setIsDueDate(!isDueDate)}
											name="set-is-due-date"
											color="primary"
										/>
									} />
									<div className="form-group">
										<input
											className="form-control"
											type="date"
											min={dateFormat(new Date(), 'yyyy-mm-dd')}
											max="2050-12-31"
											onChange={evt => setDueDate(new Date(evt.target.value))}
											value={dateFormat(dueDate, 'GMT:yyyy-mm-dd')}
											label="Fecha limite" name="fecha-limite"
											disabled={!isDueDate}
											required />
									</div>
									<div className="buttons-container d-flex justify-content-between">
										<div className="form-group d-flex justify-content-start">
											<button type="submit" className="custom-btn custom-btn-info p-2 mt-2">Guardar cambios</button>
										</div>
										<FormControlLabel className="switcher" label="Visible" control={
											<Switch
												checked={visible}
												onChange={handleVisible}
												name="visibilty"
												color="primary"
											/>
										} />
									</div>
								</form>
							</div>
							<hr />
							<div>
								<Typography variant="subtitle1" className="text-center">Actividades</Typography>
								<div className="activities-container">
									{activities && activities.length > 0 ?
										<SortableList
											distance={1}
											items={activities}
											onSortEnd={onSortEnd}
											setIsAddingActivities={setIsAddingActivities}
											setActivities={setActivities}
											task={task} />

										// <ActivityCard
										// 	setIsAddingActivities={setIsAddingActivities}
										// 	setActivities={setActivities}
										// 	task={task}
										// 	activity={activity}
										// />
										:
										<div>
											<h3 className="there-is-no-activities">Aún no hay tareas en la actividad</h3>
										</div>
									}
								</div>
								<button variant="contained" onClick={toggle} className="custom-btn custom-btn-success btn-add-activities">Agregar actividades</button>
								<ActivitiesPopup
									task={task}
									unitId={unitId}
									isOpen={isOpen}
									toggle={toggle}
									setTaskActivities={setActivities}
									isAddingActivities={isAddingActivities}
									setIsAddingActivities={setIsAddingActivities}
								/>
							</div>
						</Container>
					</div>
					:
					<Redirect to="/unauthorized" />
				: 
				<div className="spinner-loading">
				  	<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
				  	</div>
				</div>
			}
		</div>
	)
}
