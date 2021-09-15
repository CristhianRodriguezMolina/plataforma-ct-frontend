//React
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Redirect, useParams } from 'react-router-dom';

//SCSS
import './IndividualProgress.scss';

// API
import api from '../../../services/api';

//Date format
import dateFormat from 'dateformat';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// Color js
import { prominent, average } from 'color.js'

//image-exists
import imageExists from 'image-exists';

// Props types
import PropTypes from 'prop-types';

// Util
import * as util from '../../../util/util';

//COMPONENTS

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

//No Content to show
import NoContentToShow from '../../common/NoContentToShow';

// Material UI Make Styles
import { makeStyles } from '@material-ui/core/styles';

//MATERIAL UI ACCORDION
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Alert
import { Alert } from '@material-ui/lab'

// Components for the tab bar
import { AppBar, Avatar, Box, Button, Tab, Tabs, Typography } from '@material-ui/core'

// Tarjeta de titulo
import TitleCard from '../../common/TitleCard';

// Icono button
import IconButton from '@material-ui/core/IconButton';

// Iconos
import { Visibility, AccountCircle, AccountTree, BorderVertical, Ballot, Cancel, CheckCircle } from '@material-ui/icons';

// Perspective card
import PerspectiveCard from '../../evaluation/PerspectiveCard';

/* STUDENTS */
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`scrollable-force-tabpanel-${index}`}
			aria-labelledby={`scrollable-force-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3} component="div">
					<Typography component="div">{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `scrollable-force-tab-${index}`,
		'aria-controls': `scrollable-force-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		margin: 0,
		padding: 0,
	},
	bar: {
		backgroundColor: 'white',
		color: 'black',
		width: "100%",
		borderRadius: "10px"
	},
	indicator: {
		backgroundColor: '#1e88e5',
	},
	selected: {
		color: '#64b5f6',
		fontWeight: 'bold'
	},
	notSelected: {
		fontWeight: 'bold'
	},
	accordionRoot: {
		width: '100%',
		marginTop: '0.5em',
		marginBottom: '0.5em',
	},
	accordionHeading: {
		fontSize: theme.typography.pxToRem(15),
		fontWeight: theme.typography.fontWeightRegular,
	},
}));

const IndividualProgress = (props) => {

	const classes = useStyles();

	// Datos del contexto de usuario
	const { isAdmin, isTeacher, changeColor, changeFontColor } = useContext(UserContext);

	// Variables que llegan en la url de la pagina
	const { studentId, courseId } = useParams();

	// Valor actual referente a la pestaña actual abierta
	const [value, setValue] = useState(0);

	// Variable that contains the individual progress info
	const [individualProgressInfo, setIndividualProgressInfo] = useState(null);

	// Colors for the navbar in base of the image of the course
	const [color, setColor] = useState(null);

	// Background color of the student info
	const [infoStudentBGColor, setInfoStudentBGColor] = useState(`rgba(${255}, ${255}, ${255})`)

	// Variable to see if the data have load
	const [loading, setLoading] = useState(true);

	// Ref of the add perspective button
	const addPerspectiveBtn = useRef(null);

	// PERSPECTIVES VARIABLES
	const [newPerspectiveMessage, setNewPerspectiveMessage] = useState('');
	const [studentPerspectives, setStudentPerspectives] = useState(null);
	const [perspectives, setPerspectives] = useState([]);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		if (individualProgressInfo && individualProgressInfo.course) {
			if (color) {
				changeColor(`rgba(${color[0] + 100}, ${color[1] + 100}, ${color[2] + 100})`);
				setInfoStudentBGColor(`rgba(${color[0] + 100}, ${color[1] + 100}, ${color[2] + 100})`);
			}
		}
	}, [color]);

	useEffect(() => {
		const fetchIndividualProgress = async () => {
			if (!individualProgressInfo) {
				try {
					const res = await api.get(`/api/course/students/individual-progress/${studentId}/${courseId}`, {
						headers: {
							'x-access-token': localStorage.getItem('token')
						}
					});

					if (res) {
						setIndividualProgressInfo({
							studentActivities: res.data.studentActivities,
							course: res.data.course,
							taskActivities: res.data.tasksActivities,
							student: res.data.student,
							activities: res.data.activities
						});

					}

					setLoading(false);

				} catch (e) {
					setLoading(false);
				}
			} else {
				if (individualProgressInfo.course) {
					imageExists(`${process.env.REACT_APP_API_URL}/course-images/${individualProgressInfo.course.image}`, (exists) => {
						if (exists) {
							average(`${process.env.REACT_APP_API_URL}/course-images/${individualProgressInfo.course.image}`, { sample: 10 }).then(color => {
								setColor(color);
							})
						} else {
							average('/default-course-image.jpg', { sample: 10 }).then(color => {
								setColor(color);
							})
						}
					});
				}
			}
		}
		fetchIndividualProgress();
	}, [individualProgressInfo]);

	// UseEffect to get all the perspectives related to the teacher, student and course
	useEffect(() => {
		const fetchPerspectives = async () => {
			try {
				const response = await api.get(`/api/perspective/${courseId}/${localStorage.getItem('user_id')}/${studentId}`, {
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

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const watchAnswer = (unitId, taskId, activityId) => {
		props.history.push(`/activity/answer/${studentId}/${courseId}/${unitId}/${taskId}/${activityId}`);
	};

	// Method to render the table to show the data of the activities for each task
	const renderStudentProgress = (task) => {

		let items = [];

		// TaskActivities of the task that comes in the parameters
		let tempTaskActivities = individualProgressInfo.taskActivities.filter(taskActivity => taskActivity.task === task._id);
		tempTaskActivities.sort((a, b) => {
			return a.position - b.position;
		});

		// StudentActivities realted to the task that comes in the parameters
		let tempStudentActivities = individualProgressInfo.studentActivities.filter(studentActivity => studentActivity.task === task._id);

		if (tempTaskActivities.length > 0) {
			for (let i = 0; i < tempTaskActivities.length; i++) {
				let tempStudentActivity = tempStudentActivities.find(studentActivity => studentActivity.activity === tempTaskActivities[i].activity._id)

				if (tempStudentActivity) {
					let justInTime = 0;

					// To set if the activity was delivered in time or with delay
					if (tempStudentActivity.complete && task.is_due_date) {
						const due_date = new Date(dateFormat(task.due_date, 'GMT:yyyy-mm-dd'));
						const realizationDate = new Date(dateFormat(tempStudentActivity.updatedAt, 'GMT:yyyy-mm-dd'));

						if (due_date.getTime() >= realizationDate.getTime()) {
							justInTime = 1;
						} else {
							justInTime = -1;
						}
					}

					items.push(
						<tr>
							<Tooltip enterDelay={200} enterNextDelay={200} title={tempTaskActivities[i].activity.name} aria-label="activity-name">
								<td className="activity-name-field-td">
									{tempTaskActivities[i].activity.type === "logic_sequence" ?
										<AccountTree /> :
										tempTaskActivities[i].activity.type === "maze" ?
											<BorderVertical /> : <Ballot />
									}
									{`  ${tempTaskActivities[i].activity.name}`}
								</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title={tempTaskActivities[i].activity.description} aria-label="activity-description">
								<td className="activity-name-field-td">{tempTaskActivities[i].activity.description}</td>
							</Tooltip>

							<td className="completed-field-td">
								{
									tempStudentActivity.complete ?
										<CheckCircle className='completed-task-icon' />
										:
										<Cancel className='incompleted-task-icon' />
								}
							</td>

							<Tooltip enterDelay={200} enterNextDelay={200} title={tempStudentActivity.attempts} aria-label="attempts">
								<td className="grade-field-td">{tempStudentActivity.attempts}</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200}
								title={
									task.is_due_date ?
										justInTime === 1 ?
											'SI'
											:
											justInTime === -1 ?
												'NO'
												:
												'Sin fecha de entrega'
										:
										'Sin fecha de entrega'
								}
								aria-label="just-in-time">
								<td className="activity-name-field-td">
									{task.is_due_date ?
										justInTime === 1 ?
											'SI'
											:
											justInTime === -1 ?
												'NO'
												:
												'Sin fecha de entrega'
										:
										'Sin fecha de entrega'
									}
								</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title={util.getCustomDate(tempStudentActivity.updatedAt)} aria-labe="realization-date">
								<td className="activity-name-field-td">{util.getCustomDate(tempStudentActivity.updatedAt)}</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title={`${tempStudentActivity.minutes}:${tempStudentActivity.seconds}`} aria-label="realization-time">
								<td className="activity-name-field-td">{tempStudentActivity.minutes}:{tempStudentActivity.seconds}</td>
							</Tooltip>
							<Tooltip enterDelay={200} enterNextDelay={200} title="Ver respuesta" aria-label="watch-answer">
								<td className="activity-name-field-td">
									<IconButton onClick={() => watchAnswer(tempStudentActivity.unit, tempStudentActivity.task, tempStudentActivity.activity)}>
										<Visibility/>
									</IconButton>
								</td>
							</Tooltip>
						</tr>
					)
				} else {
					items.push(
						<tr>
							<Tooltip enterDelay={200} enterNextDelay={200} title={tempTaskActivities[i].activity.name} aria-label="activity-name">
								<td className="activity-name-field-td">
									{tempTaskActivities[i].activity.type === "logic_sequence" ?
										<AccountTree /> :
										tempTaskActivities[i].activity.type === "maze" ?
											<BorderVertical /> : <Ballot />
									}
									{`  ${tempTaskActivities[i].activity.name}`}
								</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title={tempTaskActivities[i].activity.description} aria-label="activity-description">
								<td className="activity-name-field-td">{tempTaskActivities[i].activity.description}</td>
							</Tooltip>

							<td className="completed-field-td">
								<Cancel className='incompleted-task-icon' />
							</td>

							<Tooltip enterDelay={200} enterNextDelay={200} title="Aún sin resolver" aria-label="attempts">
								<td className="grade-field-td">Aún sin resolver</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title="Sin fecha de entrega" aria-label="just-in-time">
								<td className="activity-name-field-td">Sin fecha de entrega</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title="Sin fecha de entrega" aria-label="realization-date">
								<td className="activity-name-field-td">Sin fecha de entrega</td>
							</Tooltip>

							<Tooltip enterDelay={200} enterNextDelay={200} title="Sin tiempo de realización" aria-label="realization-time">
								<td className="activity-name-field-td">Sin tiempo de realización</td>
							</Tooltip>
							<Tooltip enterDelay={200} enterNextDelay={200} title="Sin respuestas resgistradas" aria-label="watch-answer">
								<td className="activity-name-field-td">Sin respuestas registradas</td>
							</Tooltip>
						</tr>
					)
				}
			}
		} else {
			items.push(
				<tr>
					<td className="no-activities-task">No hay actividades para mostrar</td>
				</tr>
			)
		}

		return items;
	}

	// Method to add a new perspective to the given student 
	const handleAddPerspective = async (e) => {
		e.preventDefault();
		addPerspectiveBtn.current.disabled = true; // This is to avoid problems when the user click the button multiple times

		if (newPerspectiveMessage.trim() === '') {
			showError('Añade un mensaje de evaluación primero');
			return;
		}

		try {
			const response = await api.post(`/api/perspective/${courseId}/${localStorage.getItem('user_id')}/${studentId}`, {
				message: newPerspectiveMessage
			}, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			});

			const { perspective, message } = response.data;

			if (perspective) {
				setPerspectives(prevState => {
					return [...prevState, perspective];
				});

				setNewPerspectiveMessage('');

				showSuccess(message);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
			} else {
				showError('Ha ocurrido un error inesperado');
			}
		}
		addPerspectiveBtn.current.disabled = false;
	}

	return (
		<div>
			{
				!loading ?
					<>
						{
							individualProgressInfo && individualProgressInfo.course ?
								<TitleCard
									title={individualProgressInfo.course.name}
									color="#B6E768"
									colorFont='#fff'
									image={individualProgressInfo.course.image === '' ? '/default-course-image.jpg' : `${process.env.REACT_APP_API_URL}/course-images/${individualProgressInfo.course.image}`}
								/>
								:
								""
						}

						{

							individualProgressInfo && individualProgressInfo.student ?
								<div className='student-info' style={{ backgroundColor: infoStudentBGColor }}>
									<div className='student-info-card'>
										{individualProgressInfo.student.image !== "" ?
											<Avatar className="student-avatar mr-4" src={`${process.env.REACT_APP_API_URL}/profile/${individualProgressInfo.student.image}`} /> :
											<Avatar className="student-avatar mr-4">
												<AccountCircle style={{ fontSize: 110 }} />
											</Avatar>
										}
										<div>
											<h2 style={{ fontSize: 20 }}><span style={{ 'color': 'rgb(161, 161, 161)' }}>Estudiante: </span>{individualProgressInfo.student.first_name} {individualProgressInfo.student.last_name}</h2>
											<h2 style={{ fontSize: 20 }}><span style={{ 'color': 'rgb(161, 161, 161)' }}>Identificación: </span>{individualProgressInfo.student.id}</h2>
											<h2 style={{ fontSize: 20 }}>
												<span style={{ 'color': 'rgb(161, 161, 161)' }}>Edad: </span>
												{util.getAge(individualProgressInfo.student.birth_date)} {util.getAge(individualProgressInfo.student.birth_date) !== 1 ? 'años' : 'año'}
											</h2>
											<h2 style={{ fontSize: 20 }}><span style={{ 'color': 'rgb(161, 161, 161)' }}>Género: </span>{util.getGenre(individualProgressInfo.student.genre)}</h2>
										</div>
									</div>
								</div>
								: ""
						}

						<div className={classes.root}>
							<AppBar className={classes.bar} position="static">
								<Typography component="div">
									<div className="d-flex">

										<Tabs
											value={value}
											onChange={handleChange}
											variant="scrollable"
											scrollButtons="on"
											classes={{
												indicator: classes.indicator,
												textColor: classes.textColor
											}}
											textColor="inherit"
											aria-label="scrollable force tabs example"
											className="units-bar"
										>

											{/* TABS FOR EACH UNIT IN THE COURSE */}
											{individualProgressInfo ?
												individualProgressInfo.course.units.map((unit, index) => (
													<Tab className={value === index ? classes.selected : classes.notSelected} key={index} label={`Unidad ${index + 1}`} {...a11yProps(index)} />
												))
												: ""
											}

											{individualProgressInfo && individualProgressInfo.course.units[0] ? <div className="divider bg-white"></div> : ""}
										</Tabs>
									</div>
								</Typography>

								{success ?
									<Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
									: ""
								}

								{error ?
									<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
									: ""
								}
							</AppBar>

							{/* COMPONENTS OF EACH UNIT IN THE COURSE */}
							{
								individualProgressInfo && individualProgressInfo.course ?

									individualProgressInfo.course.units.length > 0 ?
										individualProgressInfo.course.units.map((unit, index) => {

											return <TabPanel value={value} key={index} index={index}>
												{unit.tasks.length > 0 ?
													unit.tasks.map((task) => {

														return <div className={classes.accordionRoot}>
															<Accordion>
																<AccordionSummary
																	expandIcon={<ExpandMoreIcon />}
																	aria-controls="panel1a-content"
																	id="panel1a-header"
																>

																	<Typography className={classes.accordionHeading}>{task.name}</Typography>
																</AccordionSummary>

																<AccordionDetails>
																	<Typography component="div" style={{ width: '100%' }}>
																		<div>
																			<p className='m-0'><span style={{ color: 'rgb(161, 161, 161)' }} >Description: </span>{task.description}</p>
																			{task.is_due_date ?
																				<p className='m-0'><span style={{ color: 'rgb(161, 161, 161)' }} >Fecha de entrega: </span>{task.due_date.substring(0, 10)}</p>
																				:
																				<p className='m-0'><span style={{ color: 'rgb(161, 161, 161)' }} >Fecha de entrega: </span>Sin fecha de entrega</p>
																			}
																			<hr />

																			<table className="student-progress-table-by-tasks">
																				<thead>
																					<tr>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Actividad" aria-label="activity">
																							<th className="activity-field-th">Actividad</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Descripción" aria-label="description">
																							<th className="activity-field-th">Descripción</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Completada" aria-label="complete">
																							<th className="completed-field-th">Completada</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Nota" aria-label="grade">
																							<th className="grade-field-th">Número de intentos</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Entregado a tiempo" aria-label="delivered in time">
																							<th className="activity-field-th">Entregado a tiempo</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Fecha" aria-label="date">
																							<th className="activity-field-th">Fecha</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Tiempo" aria-label="time">
																							<th className="activity-field-th">Tiempo</th>
																						</Tooltip>
																						<Tooltip enterDelay={200} enterNextDelay={200} title="Ver respuesta" aria-label="watch">
																							<th className="activity-field-th">Ver</th>
																						</Tooltip>
																					</tr>
																				</thead>

																				<tbody>
																					{renderStudentProgress(task)}
																				</tbody>
																			</table>
																		</div>

																	</Typography>
																</AccordionDetails>
															</Accordion>
														</div>
													}) :
													<NoContentToShow icon='mood' messageTitle={'Sin tareas...'} messageDes={'No hay actividades que mostrar, asegurate de añadir alguna primero.'} />}
											</TabPanel>

										}) :
										<NoContentToShow icon='mood' messageTitle={'Sin tareas...'} messageDes={'No hay actividades que mostrar, asegurate de añadir alguna primero.'} />
									:
									<Redirect to='/unauthorized' />
							}
						</div>

						{/* PERSPECTIVES */}
						<hr className='mx-5' style={{ borderWidth: '1px', borderColor: 'darkgrey' }} />
						<div className='perspectives-container container'>
							<h1 className="h4">Agregar perspectiva</h1>
							<h1 className="h6 text-muted mb-3 text-justify">Aqui puedes escribir una evaluación perspectiva del alumno en cuestión.</h1>
							<form onSubmit={handleAddPerspective} className='mb-4'>
								<div className='form-group w-md-50'>
									<textarea
										className='form-control'
										type="text"
										rows="4"
										label="Perspective"
										name="Perspectiva"
										placeholder='Escribe tu perspectiva aqui'
										onChange={evt => setNewPerspectiveMessage(evt.target.value)} value={newPerspectiveMessage} />
								</div>
								<div className='d-flex justify-content-end'>
									<button type='submit' ref={addPerspectiveBtn} className='custom-btn custom-btn-primary py-2 px-3'>Agregar</button>
								</div>
							</form>
							<h1 className="h4">Perspectivas del alumno</h1>
							<h1 className="h6 text-muted mb-3 text-justify">Aqui puedes ver las evaluaciones perspectivas que has realizado a este alumno, editarlas y/o borrarlas.</h1>
							{
								perspectives && perspectives.length > 0 ?
									perspectives.map(perspective => {
										return <PerspectiveCard perspective={perspective} setPerspectives={setPerspectives} />
									})
									:
									<NoContentToShow icon='mood' messageTitle={'Sin perspectivas...'} messageDes={'No hay perspectivas que mostrar, asegurate de añadir alguna primero.'} />
							}
						</div>
					</>
					:
					<div className="spinner-loading">
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
			}
		</div >

	)
};

export default IndividualProgress;


