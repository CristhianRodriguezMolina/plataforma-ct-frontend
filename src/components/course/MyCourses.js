import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './course.scss';

// COMPONENTS

import { Animated } from "react-animated-css";

// Title card
import TitleCard from '../common/TitleCard';

// Course Card
import CourseCard from './CourseCard';

// Alert
import Alert from '@material-ui/lab/Alert';

//No content to show
import NoContentToShow from '../common/NoContentToShow';

export default function MyCourses({ history }) {

	// Datos del contexto de usuario
	const { isAdmin, isTeacher, isStudent, changeColor } = useContext(UserContext);

	// Parametros de la ruta del router dom
	const { studentName } = useParams();

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Variable to see if the info data is loading
	const [isLoading, setIsLoading] = useState(true);

	// INFO BASE DE UN CURSO
	const [name, setName] = useState('Nuevo curso');
	const [description, setDescription] = useState('Añade una descripción para el curso');
	const [topic, setTopic] = useState('Añade un tema para el curso');

	const [courses, setCourses] = useState(null)

	const btnCreateCourse = useRef(null);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#dcedc8');
	});

	useEffect(() => {
		if (!courses) {
			getUserCourses();
		}
	}, [courses])

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

	// Funcion para mostrar una alerta información dado un mensaje
	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	}

	const getUserCourses = async () => {
		try {
			setProcess(true);
			setProcessMessage('Obteniendo cursos...');

			var response = null;

			if (!studentName || studentName === '') {
				response = await api.get(`/api/course/mycourses/${localStorage.getItem('user_id')}`, { headers: { 'x-access-token': localStorage.getItem('token') } });
			} else {
				response = await api.get(`/api/course/mycourses/student/${localStorage.getItem('user_id')}`, { headers: { 'x-access-token': localStorage.getItem('token') } });
			}

			const { courses, message } = response.data;

			if (courses) {
				setCourses(courses);

				showSuccess(message);

				setProcess(false);
				setProcessMessage('');
			} else {
				setCourses([]);
				showInfo(message);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
			} else {
				showError(`Un error ha ocurrido obteniendo los cursos ${error}`);
			}
			setProcess(false);
			setProcessMessage('');
		}
		setIsLoading(false);
	}

	// Funcion para redirigin a la pagina de edición de un curso en especifico con la history
	const redirect = course => {
		if (isAdmin || isTeacher) {
			history.push(`/course/edit/${course._id}/course-info`);
		} else if (isStudent) {
			history.push(`/course/view/${course._id}/course-info`);
		}
	}

	// Funcion para crear un curso dados unos datos basicos
	const createCourse = async () => {
		try {
			btnCreateCourse.current.disabled = true; // This is to avoid add multiple times a course

			setProcess(true);
			setProcessMessage('The course is creating...');

			const response = await api.post('/api/course', {
				name,
				creator: localStorage.getItem('user_id'),
				description,
				topic,
				visible: false
			}, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			});

			const { course, message } = response.data;

			if (course) {
				courses.push(course);

				showSuccess(message);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
			} else {
				showError("Un error ha ocurrido creando un curso");
			}
		}
		setProcess(false);
		setProcessMessage('');
		btnCreateCourse.current.disabled = false;
	}

	return (
		<div>
			<TitleCard
				title="Mis cursos"
				color="#B6E768"
			/>
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
			{
				!isLoading ?
					<>
						{
							courses && courses.length > 0 ?
								(
									<div className="courses-container mx-lg-5">
										{
											courses.map(course => (
												<CourseCard
													key={course._id}
													image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
													course={course}
													setCourses={setCourses}
													onPress={() => redirect(course)}
												/>
											))
										}
									</div>
								)
								:
								isAdmin || isTeacher ?
									<NoContentToShow icon='face' messageTitle="Sin cursos..." messageDes="No hay cursos para mostrar, primero intente crear uno" />
									:
									<NoContentToShow icon='face' messageTitle="Sin cursos..." messageDes="Aqui apareceran los cursos a los que estes inscrito" />
						}
						{
							isTeacher || isAdmin ?
								<button className="custom-btn custom-btn-success btn-create-course" ref={btnCreateCourse} onClick={() => createCourse()}>Crear curso</button>
								:
								""
						}
					</>
					:
					<div className="spinner-loading" style={{ marginTop: '2em' }}>
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
			}
		</div>
	)
}
