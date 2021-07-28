import React, { useEffect, useState } from 'react'

// API
import api from '../../../services/api';

// Props types
import PropTypes from 'prop-types';

// COMPONENTS

// Unit content student view
import UnitContent from './UnitContent';

// Material UI Make Styles
import { makeStyles } from '@material-ui/core/styles';

// Components for the tab bar
import { AppBar, Box, Button, Tab, Tabs, Typography } from '@material-ui/core';

// Alert
import { Alert } from '@material-ui/lab';

//NoTasksMessage
import NoTasksMessage from '../task/NoTasksMessage';

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
		color: 'white',
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
	}
}));

export default function UnitsInformation(props) {

	const classes = useStyles();

	// Valor actual referente a la pestaña actual abierta
	const [value, setValue] = useState(0);

	//show a message if the current unit has no task to show
	const [foundTasks, setFoundTasks] = useState(true);

	// MENSAJES DEL COMPONENTE
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	//All activities in a course
	const [taskActivities, setTaskActivities] = useState(null);
	const [studentActivities, setStudentActivities] = useState(null);

	useEffect(() => {
		if (props.course) {
			//Get activities all in the course
			api.get(`/api/course/task/activity/${props.course._id}`, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					setTaskActivities(res.data.activities);

					//Get the student progress information
					api.post("/api/student-activity/foreign", {
						student: localStorage.getItem("user_id"),
						course: props.course._id
					}, {
						headers: { 'x-access-token': localStorage.getItem('token') }
					}).then((res) => {
						setStudentActivities(res.data.studentActivity);
					}).catch(err => {
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

		if(props.course.units.length <= 0) {
			setFoundTasks(false);
		}	

	}, [props.course]);

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
	
	return (
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
							{
								props.course.units.map((unit, index) => (
									unit.visible ?
										<Tab className={value === index ? classes.selected : classes.notSelected} key={index} label={`Unidad ${index + 1}`} {...a11yProps(index)} />
										:
										''
								))
							}
							{props.course.units[0] ? <div className="divider bg-white"></div> : ""}
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
				{process ?
					<Alert className="alert-message logic-sequence-alert" severity="info">{processMessage}</Alert>
					: ""
				}
			</AppBar>
			{/* COMPONENTS OF EACH UNIT IN THE COURSE */}
			{
				props.course.units.map((unit, index) => (
					unit.visible ?
						<TabPanel value={value} key={index} index={index}>
							<UnitContent course={props.course} taskActivities={taskActivities} studentActivities={studentActivities} unitValue={unit} />
						</TabPanel>
						:
						''
				))
			}

			{!foundTasks ?
				<NoTasksMessage messageTitle={'Sin tareas...'} messageDes={'Al parecer estas de suerte porque aquí no hay nada que hacer'} />
			: ""}
		</div>
	)
}
