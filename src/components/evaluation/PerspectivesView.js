import React, { useContext, useEffect, useState } from 'react'

// API
import api from '../../services/api';

// SCSS
import './PerspectivesView.scss';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// COMPONENTES

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Perspective card
import PerspectiveCard from './PerspectiveCard';

// No content to show
import NoContentToShow from '../common/NoContentToShow';
import { Alert } from '@material-ui/lab';

const PerspectivesView = () => {

	// Datos del contexto de usuario
	const { isAdmin, isTeacher, changeColor } = useContext(UserContext);

	// Perspectives of the user
	const [perspectives, setPerspectives] = useState([]);

	// Variable to see of the data is loading
	const [isLoading, setIsLoading] = useState(true);

	// Type to filter the perspectives
	const [filterType, setFilterType] = useState('NA');

	// Variable to see thee current filter type
	const [filteredPerspectives, setFilteredPerspectives] = useState([]);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
	const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#BFA7F3');
	});

	useEffect(() => {
		if (filterType === 'COURSE') { // Grouping by course
			const result = perspectives
				.reduce((r, o) => {
					var temp = r.find(([{ course }]) => course._id === o.course._id);
					if (!temp) r.push(temp = []);
					temp.push(o);
					return r;
				}, []);

			setFilteredPerspectives(result);
		} else if (filterType === 'TEACHER') { // Grouping by teacher
			const result = perspectives
				.reduce((r, o) => {
					var temp = r.find(([{ teacher }]) => teacher._id === o.teacher._id);
					if (!temp) r.push(temp = []);
					temp.push(o);
					return r;
				}, []);

			setFilteredPerspectives(result);
		} else if (filterType === 'STUDENT') { // Grouping by student
			const result = perspectives
				.reduce((r, o) => {
					var temp = r.find(([{ student }]) => student._id === o.student._id);
					if (!temp) r.push(temp = []);
					temp.push(o);
					return r;
				}, []);

			setFilteredPerspectives(result);
		}
	}, [filterType])

	useEffect(() => {
		const fetchPerspectives = async () => {
			try {
				const response = await api.get(`/api/perspective/${localStorage.getItem('user_role')}/${localStorage.getItem('user_id')}`, {
					headers: {
						'x-access-token': localStorage.getItem('token')
					}
				});

				const { perspectives, message } = response.data;

				if (perspectives) {
					setPerspectives(perspectives);

					showSuccess(message);
				}
			} catch (error) {
				if (error.response) {
					showError(error.response.data.message);
				} else {
					showError('Ha ocurrido un error inesperado');
				}
			}
			setIsLoading(false);
		}

		if (perspectives.length <= 0) {
			fetchPerspectives();
		}
	}, [perspectives])

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

	return (
		<div>
			{/* MESSAGES */}
			{success ?
				<Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
				: ""
			}
			{info ?
				<Alert className="alert-message logic-sequence-alert" severity="info">{infoMessage}</Alert>
				: ""
			}

			<TitleCard
				title="Mis evaluaciones"
				color="#A386E4"
				colorFont='#fff'
			/>


			<div className='perspective-view-container container'>
				<h1 className="h6 text-muted my-3 text-justify">{
					isAdmin || isTeacher ?
						'Aqui puedes ver las evaluaciones perspectivas que has realizado, editarlas y/o borrarlas.'
						:
						'Aqui puedes ver las evaluaciones perspectivas que te ha realizado algún profesor.'
				}
				</h1>
				<div className="filter mr-4">
					<label className="text-start m-0 text-muted">Filtrar por</label>
					<select className="form-control" onChange={evt => { setFilterType(evt.target.value); }} value={filterType} aria-label="Default select example">
						<option value="NA" selected>N/A</option>
						<option value="COURSE">Curso</option>
						{
							isAdmin || isTeacher ?
								<option value="STUDENT">Estudiante</option>
								:
								<option value="TEACHER">Profesor</option>
						}
					</select>
				</div>
				<hr />
				{
					!isLoading ?
						perspectives && perspectives.length > 0 ?
							filterType === 'NA' ?    // NO FILTER
								perspectives.map(perspective => {
									return <PerspectiveCard perspective={perspective} setPerspectives={setPerspectives} />
								})
								:
								filterType === 'COURSE' ?		// FILTERING BY COURSE
									filteredPerspectives.map(group => {
										return <>
											<h1 className="h4 mt-4">{group[0].course.name}</h1>
											{
												group.map(perspective => {
													return <PerspectiveCard perspective={perspective} setPerspectives={setPerspectives} />
												})
											}
										</>
									})
									:
									filterType === 'TEACHER' ?		// FILTERING BY TEACHER
										filteredPerspectives.map(group => {
											return <>
												<h1 className="h4 mt-4">{group[0].teacher.first_name} {group[0].teacher.last_name}</h1>
												{
													group.map(perspective => {
														return <PerspectiveCard perspective={perspective} setPerspectives={setPerspectives} />
													})
												}
											</>
										})
										:
										filterType === 'STUDENT' ?		// FILTERING BY STUDENT
											filteredPerspectives.map(group => {
												return <>
													<h1 className="h4 mt-4">{group[0].student.first_name} {group[0].student.last_name}</h1>
													{
														group.map(perspective => {
															return <PerspectiveCard perspective={perspective} setPerspectives={setPerspectives} />
														})
													}
												</>
											})
											:
											<NoContentToShow icon='mood_bad' messageTitle='Error filtrando...' messageDes='Filtro incorrecto o error desconocido' />
							:
							<NoContentToShow icon='face' messageTitle={'Sin perspectivas...'} messageDes={localStorage.getItem('user_role') === 'student' ? 'No hay perspectivas que mostrar, aqui se mostraran las evaluaciones de tus profesores' : 'No hay perspectivas que mostrar, aqui se mostraran las que agregues a un estudiante.'} />
						:
						<div style={{ height: '10em', width: '100%', position: 'relative' }}>
							<div className="spinner-loading">
								<div className="spinner-border" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							</div>
						</div>
				}
			</div>
		</div>
	)
}

export default PerspectivesView

