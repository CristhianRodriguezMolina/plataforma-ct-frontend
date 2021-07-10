import React, { useState, useEffect, useContext } from 'react';

// CONTEXT
import UserContext from '../../context/user/UserContext';

import './MyActivities.scss';
import '../common/alert-message.scss';

//To make api calls
import api from '../../services/api';

// Title card
import TitleCard from '../common/TitleCard';

// Activities icons
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BallotIcon from '@material-ui/icons/Ballot';
import BorderVerticalIcon from '@material-ui/icons/BorderVertical';

// Alert
import Alert from '@material-ui/lab/Alert';

// Modal de confirmación 
import AlertModal from '../common/AlertModal';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const MyActivities = props => {

	// Variables del contexto
	const { changeColor } = useContext(UserContext);

	const [activities, setActivities] = useState(null);
	const [showFetchButton, setShowFetchButton] = useState(true);
	const [loadingCourses, setLoadingCourses] = useState(true);

	const [init, setInit] = useState(0);
	const [fin, setFin] = useState(0);
	const [count, setCount] = useState(0);
	const range = Math.round((window.innerHeight - 240) / 48);

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


	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#f8bbd0');
	});

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

	useEffect(() => {
		if (!activities) {
			const fetch = () => {
				api.get(`/api/activity/myactivities/${localStorage.getItem('user_id')}`, {
					headers: { 'x-access-token': localStorage.getItem('token') }
				})
					.then((response) => {
						console.log(response.data.activities)
						setActivities(response.data.activities);
						setCount(response.data.count);
						if (response.data.count == 0) {
							setLoadingCourses(false);
							setShowFetchButton(false);
						}
					}).catch((error) => {
						//Show errors ocurred during the process
						showError("Un error ha ocurrido, por favor intentelo de nuevo mas tarde");
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
			if (fin >= count) {
				setShowFetchButton(false);
			}
		}
	}, [fin]);

	const loadActivities = () => {
		if (fin < count) {
			setInit(init + range);
			setFin(fin + range);
			setLoadingCourses(true);
		}
		else {
			setShowFetchButton(false);
		}

	};

	const handleEdit = (type) => {
		console.log(type)
		if (type.localeCompare("logic_sequence") === 0) {
			props.history.push(`/activity/logic-sequence/${currentMenu._id}`);
		}
		else if (type.localeCompare("maze") === 0) {
			props.history.push(`/activity/maze/${currentMenu._id}`);
		}
		else {
			console.log('type not valid');
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
					showError("Un error ha ocurrido, por favor intentelo de nuevo mas tarde");
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
			<table className="activities-list">
				<thead>
					<tr>
						<th className="name-tag">Nombre</th>
						<th>Descripción</th>
						<th>Última modificación</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{activities ?
						(activities.slice(0, fin).map((activity, i) => (
							<tr key={i}>
								<td className="activity-name">
									{
										activity.type.localeCompare("logic_sequence") === 0 ?
											<AccountTreeIcon className="activity-icon" /> : activity.type.localeCompare("maze") === 0 ?
												<BorderVerticalIcon className="activity-icon" /> : <BallotIcon className="activity-icon" />
									}
									{activity.name}
								</td>
								<td className="activity-description">
									{activity.description}
								</td>
								<td>{activity.updatedAt.slice(0, 10)}</td>
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

						)))
						: null
					}

				</tbody >
			</table >
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Esta seguro que quiere eliminar esta actividad?'
				action={() => handleDelete(activityIdToDelete)}
			/>
			{
				loadingCourses
					? <Alert severity="info">{"Cargando actividades... por favor espere"}</Alert>
					: ""
			}

			{
				showFetchButton
					? <button type="button" className="btn btn-light btn-block" onClick={loadActivities}>Load more</button>
					: ""
			}
		</div >
	)
};

export default MyActivities;