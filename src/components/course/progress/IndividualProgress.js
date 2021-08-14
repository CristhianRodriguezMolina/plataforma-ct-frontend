//React
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

//SCSS
import './IndividualProgress.scss';

// API
import api from '../../../services/api';

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

//NoTasksMessage
import NoTasksMessage from '../task/NoTasksMessage';

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

import { Cancel, CheckCircle } from '@material-ui/icons'

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
		backgroundColor: 'yellowgreen',
	},
	selected: {
		color: '#558b2f',
		fontWeight: 'bold'
	},
	notSelected: {
		fontWeight: 'bold'
	},
	accordionRoot: {
		width: '100%',
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

	const [individualProgressInfo, setIndividualProgressInfo] = useState(null);

	// Colors for the navbar in base of the image of the course
	const [color, setColor] = useState(null);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	useEffect(async () => {
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
						student: res.data.student
					});

					console.log(res.data.course)
				}

			} catch (e) {
				console.log(e);
			}
		} else {
			if (individualProgressInfo.course) {
				imageExists(`${process.env.REACT_APP_API_URL}/course-images/${individualProgressInfo.course.image}`, (exists) => {
					if (exists) {
						average(`${process.env.REACT_APP_API_URL}/course-images/${individualProgressInfo.course.image}`, { sample: 10 }).then(color => {
							console.log(color); // [241, 221, 63]
							setColor(color);
						})
					}
				});
			}
		}
	}, [individualProgressInfo]);

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

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		if (individualProgressInfo && individualProgressInfo.course) {
			if (color) {
				changeColor(`rgba(${color[0] + 100}, ${color[1] + 100}, ${color[2] + 100})`);
			}
		}
	}, [color]);

	const renderStudentProgress = (taskId) => {

		let items = [];

		let tempTaskActivities = individualProgressInfo.taskActivities.filter(taskActivity => taskActivity.task === taskId);
		tempTaskActivities.sort((a, b) => {
			return a.position - b.position;
		});
		let tempStudentActivities = individualProgressInfo.studentActivities.filter(studentActivity => studentActivity.task === taskId);

		if (tempTaskActivities.length > 0) {
			for (let i = 0; i < tempTaskActivities.length; i++) {
				let tempStudentActivity = tempStudentActivities.find(studentActivity => studentActivity.activity === tempTaskActivities[i].activity._id)

				if (tempStudentActivity) {
					items.push(
						<tr>
							<td className="activity-name-field-td">{tempTaskActivities[i].activity.name}</td>
							<td className="completed-field-td">
								{
									tempStudentActivity.complete ?
										<CheckCircle className='completed-task-icon' />
										:
										<Cancel className='incompleted-task-icon' />
								}
							</td>
							<td className="grade-field-td">{tempStudentActivity.grade}</td>
						</tr>
					)
				} else {
					items.push(
						<tr>
							<td className="activity-name-field-td">{tempTaskActivities[i].activity.name}</td>
							<td className="completed-field-td">
								<Cancel className='incompleted-task-icon' />
							</td>
							<td className="grade-field-td">Aún sin resolver</td>
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

	return (
		<div>
			{
				individualProgressInfo && individualProgressInfo.course ?
					<TitleCard
						title={individualProgressInfo.course.name}
						color="#B6E768"
						colorFont='#fff'
						image={`${process.env.REACT_APP_API_URL}/course-images/${individualProgressInfo.course.image}`}
					/>
					:
					""
			}
			{individualProgressInfo && individualProgressInfo.student ?
				<div className='student-info'>
					<div className='student-info-card'>
						<Avatar className="student-avatar mr-4" src="https://picsum.photos/200/300" />
						<div>
							<h2><span style={{ 'color': 'rgb(161, 161, 161)' }}>Estudiante: </span>{individualProgressInfo.student.first_name} {individualProgressInfo.student.last_name}</h2>
							<h2><span style={{ 'color': 'rgb(161, 161, 161)' }}>Identificación: </span>{individualProgressInfo.student.id}</h2>
							<h2><span style={{ 'color': 'rgb(161, 161, 161)' }}>Edad: </span>{util.getAge(individualProgressInfo.student.birth_date)} años</h2>
							<h2><span style={{ 'color': 'rgb(161, 161, 161)' }}>Género: </span>{util.getGenre(individualProgressInfo.student.genre)}</h2>
						</div>
					</div>
				</div>
				: ""}
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
							{individualProgressInfo && individualProgressInfo.course.units[0] ? <div className="divider"></div> : ""}
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
																<table className="student-progress-table-by-tasks">
																	<thead>
																		<tr>
																			<th className="activity-field-th">Actividad</th>
																			<th className="completed-field-th">Completada</th>
																			<th className="grade-field-th">Nota</th>
																		</tr>
																	</thead>
																	<tbody>
																		{renderStudentProgress(task._id)}
																	</tbody>
																</table>
															</div>
														</Typography>
													</AccordionDetails>
												</Accordion>
											</div>
										}) :
										<NoTasksMessage messageTitle={'Sin tareas...'} messageDes={'No hay actividades que mostrar, asegurate de añadir alguna primero.'} />}
								</TabPanel>
							}) :
							<NoTasksMessage messageTitle={'Sin tareas...'} messageDes={'No hay actividades que mostrar, asegurate de añadir alguna primero.'} />
						: ""
				}
			</div>
		</div>

	)
};

export default IndividualProgress;


