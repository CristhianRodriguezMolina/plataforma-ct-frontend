import React, { useEffect, useContext, useState } from 'react'

// SCSS
import './UnitContent.scss';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// COMPONENTS

// Title card
import TitleCard from '../../common/TitleCard';

// Material UI components (Core)
import { Container, Typography, Button } from '@material-ui/core';

// Activity card
import ActivityCard from '../activity/ActivityCard';

export default function ManageTask() {

	// Variables del cotexto
	const { changeColor } = useContext(UserContext);

	// Data of the task
	const [taskName, setTaskName] = useState("Task name");
	const [taskDescription, setTaskDescription] = useState("Task description");

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#dcedc8');
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(taskName);
		console.log(taskDescription);
	}

	return (
		<div>
			<TitleCard
				title="My Course"
				color="#B6E768"
			/>
			<Container className="task-manage-container" maxWidth="sm">
				<div>
					<Typography><b>Unidad 1 | Nombre de la task</b></Typography>
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
					<Button variant="contained" color="secondary" className="btn-add-activities">Agregar actividades</Button>
				</div>
			</Container>
		</div>
	)
}
