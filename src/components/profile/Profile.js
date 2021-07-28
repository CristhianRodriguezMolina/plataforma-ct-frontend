import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './profile.scss';

// util
import * as util from '../../util/util';

// COMPONENTS

// Profile overview
import Overview from './Overview';

// Edit profile
import EditProfile from './EditProfile';

// Change Password
import ChangePassword from './ChangePassword';

// Material UI core
import { Avatar, IconButton, Fade, Modal, Backdrop } from '@material-ui/core';

// Iconos
import { Edit } from '@material-ui/icons'

// Dropzone
import DropzoneUploader from '../common/DropzoneUploader';

export default function Profile(props) {

	// Variables que llegan en la url de la pagina
	const { userId, view } = useParams();

	// Variables que llegan por los props del componente
	const { history } = props;

	// Datos del contexto de usuario
	const { changeColor } = useContext(UserContext);

	// User of the session
	const [user, setUser] = useState(null);

	// Variable that watch if the user data is change
	const [isChangingData, setIsChangingData] = useState(false)

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
	const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	const [upload, setUpload] = useState(false)

	// Falg of the modal to add image
	const [open, setOpen] = useState(false);

	// Toggle of the modal to upload an image
	const toggle = () => setOpen(!open);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#B6F2FF');
	});

	// UseEffect that watch if the route is valid
	useEffect(() => {
		if (view !== "overview" && view !== "edit-profile" && view !== "change-password") {
			history.push('/unauthorized');
		}
		if (userId) { // En caso de que llegue una ID de usuario por la ruta            
			fetchUser();
		}
	}, [view])

	// UseEffect that fetch the data of the user for the profile
	useEffect(() => {
		if (!user || isChangingData) {
			fetchUser();
		}
	}, [user])

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

	// Funcion para mostrar una alerta de info dado un mensaje
	const showInfo = (message) => {
		setInfo(true);   //Se cambia el estado de mensaje de proceso a verdadero
		setInfoMessage(message); //Se setea el mensaje de proceso 
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setInfo(false);
			setInfoMessage("");
		}, 2000)
	}

	// Method that fetch the data of the user for the profile
	const fetchUser = async () => {
		try {
			const response = await api.get(`/api/person/${userId}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const { user, message } = response.data;
			if (user) {
				setIsChangingData(false);

				setUser(user);
			}
		} catch (error) {
			if (error.response) {
				console.log(error.response.data.message)
				showError(error.response.data.message);
			} else {
				console.log(error)
				showError('Error en el servidor');
			}
		}
	}

	// Method to watch if something is uploading
	const handleUpload = () => {
		setUpload(!upload);
	}

	// Method that upload the image of the user to the server
	const uploadImage = async (files) => {
		try {
			if (files.length > 0) {
				setInfo(true);
				setInfoMessage('Subiendo imagen de perfil al servidor...');

				const form = new FormData()
				form.append('folder', 'profile');
				form.append('image', files[0]);

				const config = {
					headers: {
						'content-type': 'multipart/form-data', //Para aceptar archivos binarios
						'content-type': 'application/json',
						'x-access-token': localStorage.getItem('token')
					}
				}

				const response = await api.post(`api/data/upload-profile-img-user/${user._id}`, form, config);

				const { updatedUser, message } = response.data;

				if (updatedUser) {
					setUser(prevValues => { return { ...prevValues, image: updatedUser.image } }); // Se actualiza la imagen del usuario de la vista actual del perfil

					localStorage.setItem('user_image', updatedUser.image); // Se cambia la imagen en el localstorage para que se muestre en la navegacion

					showSuccess(message);

					toggle(); //Toggle para cerrar el modal de imagen de perfil despues de actualizar la imagen

					history.push(`/profile/${user._id}/${view}`); // Se redirige a la misma pagina en la que se encuentra el usuario para que se actualice la imagen de la navegacion
				}
			} else {
				console.log(files);
				showInfo('Selecciona alguna imagen')
			}
		} catch (error) {
			if (error.response) {
				console.log(error.response.data.message);
				showError(error.response.data.message);
			} else {
				console.log('Error en el servidor');
				showError('Error en el servidor');
			}
		}
		setUpload(!upload);
		setInfo(false);
		setInfoMessage('');
	}

	return (
		<div className='profile-container'>
			<div className='profile'>
				<div className='row h-100'>
					<div className='pricipal-info-section col-md-4'>
						{
							user ?
								<div className='avatar-container'>
									{
										user.image ?
											<Avatar className='profile-avatar' src={`${process.env.REACT_APP_API_URL}/profile/${user.image}`} />
											:
											<Avatar className='profile-avatar' />
									}
									<div className='edit-image-button'>
										<IconButton onClick={toggle} size='medium' color='primary'>
											<Edit color='action' />
										</IconButton>
									</div>
									<Modal
										aria-labelledby="transition-modal-title"
										aria-describedby="transition-modal-description"
										className='d-flex justify-content-center align-items-center'
										open={open}
										onClose={toggle}
										closeAfterTransition
										BackdropComponent={Backdrop}
										BackdropProps={{
											timeout: 500,
										}}
									>
										{/* <Fade in={open}> */}
										<div style={{
											backgroundColor: "#424242",
											color: "white",
											borderRadius: "10px",
											padding: "2em 3em",
											filter: "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
										}}>
											<h1 className='h3 text-white'>Cambiar imagen</h1>
											<DropzoneUploader
												onFormSubmit={uploadImage}
												upload={upload}
												type="image/jpeg, image/png, image/gif"
												maxFiles="1"
											/>
											<div className='d-flex justify-content-end'>
												<button onClick={handleUpload} className='custom-btn custom-btn-primary p-2 mr-2'>Guardar imagen</button>
												<button onClick={toggle} className='custom-btn p-2'>Cancelar</button>
											</div>
										</div>
										{/* </Fade> */}
									</Modal>
								</div>
								:
								""
						}
						{
							user ?
								<div className='text-center mt-3'>
									<h1 className='h3'>{user.first_name} {user.last_name}</h1>
									<p>{util.getRole(user.role)}</p>
									<p>{util.getAge(user.birth_date)} años</p>
								</div>
								:
								''
						}
					</div>
					<div className='data-section col-md-8'>
						{
							view === 'overview' ?
								<Overview user={user} />
								:
								view === 'edit-profile' ?
									<EditProfile user={user} setIsChangingData={setIsChangingData} setUser={setUser} />
									:
									view === 'change-password' ?
										<ChangePassword user={user} setIsChangingData={setIsChangingData} />
										:
										''
						}
					</div>
				</div>
			</div>
		</div >
	)
}
