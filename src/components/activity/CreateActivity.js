import React, { useState, useEffect, useContext } from 'react';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// SCSS
import './CreateActivity.scss';
import '../common/alert-message.scss';

// to make API calls
import api from '../../services/api';

// Title card
import TitleCard from '../common/TitleCard';

// Alert
import Alert from '@material-ui/lab/Alert';


const CreateActivity = (props) => {

	// Variables del cotexto
	const { changeColor } = useContext(UserContext);

	const [name, setName] = useState(''); //Save the data registered in name field
	const [description, setDescription] = useState(''); //Save the data registered in description field
	const [type, setType] = useState('logic_sequence')//Save the selected option in radio buttons

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso

	// Funcion para mostrar una alerta de error dado un mensaje
	const showError = (message) => {
		setError(true);   //Se cambia el estado de mensaje de error a verdadero
		setErrorMessage(message); //Se setea el mensaje de error
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setError(false);
			setErrorMessage("");
		}, 2000)
	}

	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	}

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#f8bbd0');
	});

	const handleSubmit = (e) => {
		e.preventDefault(); //Prevent form reload the webside

		//Verifying fields
		if (name.trim().localeCompare("") !== 0) {
			//Making API calls
			api.post('/api/activity', {
				name,
				description,
				type,
				creator: localStorage.getItem('user_id'),
			}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					props.history.push(`/activity/logic-sequence/${res.data.activity_id}`);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					}
				})
		}
		else {
			showInfo("El nombre de la actividad es requerido");
		}
	}

	return (
		<div>
			<TitleCard
				title="Gestión de actividades"
				color="#FA61CD"
			/>

			<div className="create-activity-container">
				<h1 className="title">Create new activity</h1>
				<p>A repository contains all project files, including the revision history. Already have a project repository elsewhere?</p>
				<hr />
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label className="form-label">Nombre <span style={{ color: "red" }}>*</span></label>
						<input className="form-control" type="text" id="name" name="name" onChange={evt => setName(evt.target.value)} required></input>
					</div>
					<div className="form-group">
						<label className="form-label">Descripción <span style={{ color: "rgb(129, 129, 129)" }}>(Opcional)</span></label>
						<textarea className="form-control" type="text" id="description" name="description" onChange={evt => setDescription(evt.target.value)}></textarea>
					</div>
					<hr />
					<h2>Tipo de actividad *</h2>
					<div className="radio-group d-flex justify-conetent-start align-items-center">
						<input className="radio-button" type="radio" id="logic_sequence" name="activity" value="logic_sequence" onChange={evt => setType(evt.target.value)} />
						<div>
							<label className="title-label" for="logic_sequence">Secuencia lógica</label><br />
							<label className="description-label" for="logic_sequence">Ordena las secuencias en el orden correcto en el que se realiza una acción.</label><br />
						</div>
					</div>
					<div className="radio-group d-flex justify-conetent-start align-items-center">
						<input className="radio-button" type="radio" id="maze" name="activity" value="maze" onChange={evt => setType(evt.target.value)} />
						<div>
							<label className="title-label" for="maze">Laberinto</label><br />
							<label className="description-label" for="maze">Guia al personaje a través del laberinto.</label><br />
						</div>
					</div>
					<div className="radio-group d-flex justify-conetent-start align-items-center">
						<input className="radio-button" type="radio" id="questionnaire" name="activity" value="questionnaire" onChange={evt => setType(evt.target.value)} />
						<div>
							<label className="title-label" for="questionnaire">Cuestionario</label><br />
							<label className="description-label" for="questionnaire">Selecciona la respuesta correcta</label><br />
						</div>
					</div>
					<hr />
					<button className="btn btn-success" type="submit">Crear Actividad</button>
				</form>
			</div>
			{
				error ?
					<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
					: ""
			}
			{
				process ?
					<Alert className="alert-message logic-sequence-alert" severity="info">{processMessage}</Alert>
					: ""
			}
		</div >
	)
};

export default CreateActivity;