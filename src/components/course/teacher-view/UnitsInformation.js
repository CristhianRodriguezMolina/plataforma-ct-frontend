import React, { useState, useEffect } from 'react'

// API
import api from '../../../services/api';

// SCSS
import './teacherview.scss';

// Props types
import PropTypes from 'prop-types';

// COMPONENTS

// MAterial UI Make Styles
import { makeStyles } from '@material-ui/core/styles';

// Components for the tab bar
import { AppBar, Box, Button, Tab, Tabs, Typography } from '@material-ui/core'

// Alert
import { Alert } from '@material-ui/lab'

// Icons
import { ControlPoint } from '@material-ui/icons';

// Colors
import { red, lightGreen } from '@material-ui/core/colors';

// Unit content
import UnitContent from './UnitContent';

// Scroll
import { animateScroll as scroll } from 'react-scroll';

// WithRouter
import { withRouter } from 'react-router-dom';

/* TEACHER */
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

const UnitsInformation = (props) => {

	const classes = useStyles();

	// Valor actual referente a la pestaña actual abierta
	const [value, setValue] = useState(0);

	// Auxiliar para llevar al cuenta de los datos
	const [addingUnit, setAddingUnit] = useState(false);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	// Visibility for the components animation
	const [visible, setVisible] = useState(true);

	// UseEffect para cambiar la pestaña actual a la pestaña que se cree nueva
	useEffect(() => {
		if (props.course.units.length > 0 && addingUnit) {
			setValue(props.course.units.length - 1);
			setAddingUnit(false);
		}
	}, [props.course])

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

	// Method to do a smooth scroll
	const scrollTo = () => {
		scroll.scrollTo(0, {
			duration: 500,
		})
	}

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// Metodo para crear una nueva unidad con unos datos basicos en el curso actual que se renderiza en el componente
	const addUnit = async () => {
		try {
			setProcess(true);
			setProcessMessage('Creando una nueva unidad...');

			const response = await api.post(`/api/course/unit/${props.course._id}`, {
				name: "Nueva unidad",
				description: "Añade una descripción"
			}, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const { updatedCourse, message } = response.data;

			if (updatedCourse) {
				showSuccess(message);
				setAddingUnit(true);
				props.setCourse(updatedCourse);
			} else {
				showError(message);
			}
		} catch (error) {
			if (error.response) {
				console.log(`Un error ha ocurrido creando una unidad: ${error}`);
				showError(error.response.data.message);
			} else {
				console.log(`Un error ha ocurrido creando una unidad: ${error}`);
				showError(`Un error ha ocurrido creando una unidad: ${error}`);
			}
		} finally {
			setProcess(false);
			setProcessMessage('')
		}
	}

	// Metodo para borrar una unidad del curso actual dada la id de la unidad
	const deleteUnit = async (unitId) => {
		try {
			setProcess(true);
			setProcessMessage('Borrando una nueva unidad...');

			const response = await api.delete(`/api/course/unit/${props.course._id}/${unitId}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			scrollTo();

			const { updatedCourse, message } = response.data;

			if (updatedCourse) {
				showSuccess(message);
				setAddingUnit(true);
				props.setCourse(updatedCourse);
			} else {
				showError(message);
			}
		} catch (error) {
			if (error.response) {
				console.log(`Un error ha ocurrido borrando una unidad: ${error}`);
				showError(error.response.data.message);
			} else {
				console.log(`Un error ha ocurrido borrando una unidad: ${error}`);
				showError(`Un error ha ocurrido borrando una unidad: ${error}`);
			}
		} finally {
			setProcess(false);
			setProcessMessage('')
		}
	}

	const handleUpdateUnit = (unit) => {
		if (unit.name.trim().localeCompare("") !== 0) {
			api.put(`/api/course/unit/${props.course._id}/${unit._id}`, {
				unit
			}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then(res => {
					showSuccess(res.data.message);
					props.setCourse(res.data.updatedCourse);
				})
				.catch(err => {
					if (err.response.data.message) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					}
				})
		}
		else {
			showError("El nombre de la unidad es obligatorio");
		}
	};

	const handleAddTask = (unitID) => {
		api.post(`/api/course/task/${props.course._id}/${unitID}`, {
			name: "Mi tarea",
			description: "Esta es mi tarea"
		}, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then(res => {
				let task = res.data.task;
				props.history.push(`/course/edit/${props.course._id}/units-info/${unitID}/${task._id}`);
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					console.log('err');
					console.log(err);
					showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
				}
			});
	}

	const handleDeleteTask = (unitId, taskId) => {
		api.delete(`/api/course/task/${props.course._id}/${unitId}/${taskId}`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				showSuccess(res.data.message);
				props.setCourse(res.data.updatedCourse);
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
				}
			})
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
									<Tab className={value === index ? classes.selected : classes.notSelected} key={index} label={`Unidad ${index + 1}`} {...a11yProps(index)} />
								))
							}
							{props.course.units[0] ? <div className="divider bg-white"></div> : ""}
						</Tabs>
						{props.course.units[0] ? <div className="divider"></div> : ""}.
						{/* BUTTON TO ADD NEW UNITS */}
						<Button onClick={() => addUnit()} className={classes.selected}><ControlPoint /> Añadir unidad</Button>
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
					<TabPanel value={value} key={index} index={index}>
						<UnitContent course={props.course} unitValue={unit} onAddTask={handleAddTask} onUpdateChanges={handleUpdateUnit} onDeleteUnit={deleteUnit} onDeleteTask={handleDeleteTask} />
					</TabPanel>
				))
			}
		</div>
	)
}

export default withRouter(UnitsInformation);
