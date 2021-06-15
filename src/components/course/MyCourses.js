import React, { useState, useEffect, useContext } from 'react';

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

export default function MyCourses({ history }) {

	// Datos del contexto de usuario
	const { isAdmin, isTeacher, isStudent, changeColor } = useContext(UserContext);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// INFO BASE DE UN CURSO
	const [name, setName] = useState('Nuevo curso');
	const [description, setDescription] = useState('Añade una descripción para el curso');
	const [topic, setTopic] = useState('Añade un tema para el curso');

	const [courses, setCourses] = useState(null)

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#dcedc8');
	});

	useEffect(() => {
		if (!courses) {
			getUserCourses();
		}
	}, [courses])

	const getUserCourses = async () => {
		try {
			setProcess(true);
			setProcessMessage('Obteniendo cursos...');

			const response = await api.get(`/api/course/mycourses/${localStorage.getItem('user_id')}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const { courses, message } = response.data;

			if (courses) {
				setCourses(courses);

				setProcess(false);
				setProcessMessage('');

				showSuccess(message);
			} else {
				setProcess(false);
				setProcessMessage('');
				showError(message);
			}
		} catch (error) {
			if (error.response) {
				console.log(`Un error ha ocurrido obteniendo los cursos ${error}`);
				showError(error.response.data.message);
			} else {
				console.log(`Un error ha ocurrido obteniendo los cursos ${error}`);
				showError(`Un error ha ocurrido obteniendo los cursos ${error}`);
			}
			setProcess(false);
			setProcessMessage('');
		}
	}

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
			setProcess(false);
			setProcessMessage('');

			courses.push(course);

			showSuccess(message);
		} else if (message) {
			showError(message);
		} else {
			showError('Error inesperado en el servidor');
		}
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
				<Alert severity="info">{processMessage}</Alert>
				: ""
			}
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
					(
						<div>
							<h3 className="there-is-no-courses">Aún no hay cursos</h3>
						</div>
					)
			}
			{
				isTeacher || isAdmin ?
					<button className="btn btn-success btn-create-course" onClick={() => createCourse()}>Crear curso</button>
					:
					""
			}
		</div>
	)
}
