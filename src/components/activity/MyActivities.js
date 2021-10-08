import React, { useState, useEffect, useContext } from 'react';

// CONTEXT
import UserContext from '../../context/user/UserContext';

import './MyActivities.scss';
import '../common/alert-message.scss';

//To make api calls
import api from '../../services/api';

// Activities icons
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BallotIcon from '@material-ui/icons/Ballot';
import BorderVerticalIcon from '@material-ui/icons/BorderVertical';

//Util
import * as  util from '../../util/util'

// COMPONENTS


// Title card
import TitleCard from '../common/TitleCard';

// Alert
import Alert from '@material-ui/lab/Alert';

// Modal de confirmación 
import AlertModal from '../common/AlertModal';

//Search Activity
import SearchActivity from '../common/SearchActivity';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import NoContentToShow from '../common/NoContentToShow';



const MyActivities = props => {

	// Variables del contexto
	const { changeColor } = useContext(UserContext);

	const [activities, setActivities] = useState(null);
	const [showFetchButton, setShowFetchButton] = useState(true);
	const [loadingCourses, setLoadingCourses] = useState(true);

	const [init, setInit] = useState(0);
	const [fin, setFin] = useState(0); // The end of the acvitivities range 
	const [count, setCount] = useState(0); //The number of documents
	const [range, setRange] = useState(Math.round((window.innerHeight - 330) / 48)); //Number of activities to show depends of windows height
	const [currentMenu, setCurrentMenu] = useState(false);

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	// ID de la actividad actual a ser borrada
	const [activityIdToDelete, setActivityIdToDelete] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	//Filtered Activities
	const [filteredActivities, setFilteredActivities] = useState(activities);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#f8bbd0');
	});

	//Set the range to 1 when it is lower than 0
	useEffect(() => {
		if (range <= 0) {
			setRange(1);
		}
	}, [range]);

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

	//Fetch the activities
	useEffect(() => {
		if (!activities) {
			const fetch = () => {
				api.get('/api/activity/', {
					headers: { 'x-access-token': localStorage.getItem('token') }
				})
					.then((response) => {

						const userActivities = response.data.activities.filter(activity => activity.creator._id === localStorage.getItem("user_id"));
						const otherActivities = response.data.activities.filter(activity => activity.creator._id !== localStorage.getItem("user_id"));

						const result = otherActivities
							.reduce((r, o) => {
								var temp = r.find(([{ creator }]) => creator.first_name === o.creator.first_name);
								if (!temp) r.push(temp = []);
								temp.push(o);
								return r;
							}, []);

						var tempActivities = [];
						result.map(res => {
							res.map(r => {
								tempActivities.push(r);
							});
						});

						setActivities([...userActivities, ...tempActivities]);


						setFilteredActivities([...userActivities, ...tempActivities]);
						setCount(response.data.count);
						if (response.data.count == 0) {
							setLoadingCourses(false);
							setShowFetchButton(false);
						}
					}).catch((error) => {
						//Show errors ocurred during the process
						showError("Un error ha ocurrido, por favor inténtelo de nuevo mas tarde");
						setLoadingCourses(false);
					});
			};
			fetch();
		}
	}, [activities]);


	useEffect(() => {
		if (count !== 0) {
			setFin(range);
		}
	}, [count]);

	useEffect(() => {
		if (init < fin) {
			setLoadingCourses(false);
			if (fin >= filteredActivities.length) {
				setShowFetchButton(false);
			}
		}
	}, [fin]);

	//when you filter the activities, it resets the init and fin vars
	useEffect(() => {
		if (filteredActivities && count !== 0) {
			setInit(0);
			setFin(range);
			if (filteredActivities.length > range) {
				setShowFetchButton(true);
			}
			else {
				setShowFetchButton(false);
			}
		}
	}, [filteredActivities]);

	const loadActivities = () => {
		if (fin < filteredActivities.length) {
			setInit(init + range);
			setFin(fin + range);
			setLoadingCourses(true);
		}
		else {
			setShowFetchButton(false);
		}

	};

	const handleEdit = (type) => {
		if (type.localeCompare("logic_sequence") === 0) {
			props.history.push(`/activity/logic-sequence/${currentMenu._id}`);
		}
		else if (type.localeCompare("maze") === 0) {
			props.history.push(`/activity/maze/${currentMenu._id}`);
		}
		else if (type.localeCompare('questionnaire') === 0) {
			props.history.push(`/activity/questionnaire/${currentMenu._id}`);
		}
		else {
			showError('Type not valid');
		}
	};

	const handleDelete = (activity_id) => {
		handleClose();
		api.delete(`/api/activity/${activity_id}`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				let array = activities.filter((activity, i) => activity._id !== activity_id);
				setActivities(array);
				showSuccess(res.data.message)
			})
			.catch(err => {
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("Un error ha ocurrido, por favor inténtelo de nuevo mas tarde");
				}
			})
	};

	const handleClick = (event, activity) => {
		setCurrentMenu(activity);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (

		<div className="my-activities-container">
			{success ?
				<Alert className="alert-message" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="alert-message" severity="error">{errorMessage}</Alert>
				: ""
			}
			<TitleCard
				title="Mis actividades"
				color="#FA61CD"
				colorFont="#FFF"
			/>

			<div className='search-container' >
				<SearchActivity activities={activities} filteredActivities={filteredActivities} setFilteredActivities={setFilteredActivities} />
			</div>
			{
				!loadingCourses ?
					filteredActivities && filteredActivities.length > 0 ?
						<table className="activities-list">
							<thead>
								<tr>
									<th className="name-tag">Nombre</th>
									<th>Descripción</th>
									<th>Creador</th>
									<th>Última modificación</th>
									<th></th>
								</tr>
							</thead>

							<tbody>
								{
									filteredActivities.slice(0, fin).map((activity, i) => (
										<tr key={i}>
											<Tooltip enterDelay={200} enterNextDelay={200} title={activity.name} aria-label={activity.name}>
												<td className="activity-name">
													{
														activity.type.localeCompare("logic_sequence") === 0 ?
															<AccountTreeIcon className="activity-icon" /> : activity.type.localeCompare("maze") === 0 ?
																<BorderVerticalIcon className="activity-icon" /> : <BallotIcon className="activity-icon" />
													}
													{activity.name}
												</td>
											</Tooltip>

											<Tooltip enterDelay={200} enterNextDelay={200} title={activity.description} aria-label={activity.description}>
												<td className="activity-description">
													{activity.description}
												</td>
											</Tooltip>
											<Tooltip enterDelay={200} enterNextDelay={200} title={`${activity.creator.first_name} ${activity.creator.last_name}`} aria-label={activity.description}>
												<td className="activity-description">
													{activity.creator.first_name} {activity.creator.last_name}
												</td>
											</Tooltip>
											<td>{util.getCustomDate(activity.updatedAt)}</td>
											<td>
												<div className="drop-menu">
													<div onClick={(e) => handleClick(e, activity)} className="drop-button">...</div>
													<Menu
														elevation={1}
														id="simple-menu"
														anchorEl={anchorEl}
														keepMounted
														open={Boolean(anchorEl)}
														onClose={handleClose}
													>
														<MenuItem onClick={() => { handleEdit(currentMenu.type) }}>Editar</MenuItem>
														<MenuItem onClick={() => { setOpen(!open); setActivityIdToDelete(currentMenu._id); }}>Borrar</MenuItem>
													</Menu>
												</div >
											</td >
										</tr >

									))
								}

							</tbody >
						</table >
						:
						<>
							<table className="activities-list">
								<thead>
									<tr>
										<th className="name-tag">Nombre</th>
										<th>Descripción</th>
										<th>Última modificación</th>
										<th></th>
									</tr>
								</thead>
							</table>
							<NoContentToShow icon='face' messageTitle="Sin actividades..." messageDes="Las actividades que agregues apareceran aquí" />
						</>
					:
					<div className="spinner-loading" style={{ marginTop: '8em' }}>
						<div className="spinner-border" role="status">
							<span className="sr-only">Loading...</span>
						</div>
					</div>
			}
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Está seguro que quiere eliminar esta actividad?'
				action={() => handleDelete(activityIdToDelete)}
			/>
			{
				loadingCourses
					? <Alert severity="info">{"Cargando actividades... por favor espere"}</Alert>
					: ""
			}

			{
				showFetchButton && !loadingCourses && filteredActivities.length > 0 ?
					<button type="button" className="btn btn-light btn-block" onClick={loadActivities}>Cargar más</button>
					: ""
			}
		</div >
	)
};

export default MyActivities;
