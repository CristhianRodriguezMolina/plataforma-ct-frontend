import React, { useState, useEffect, useContext, useRef } from 'react';

//SCSS
import './QuestionCard.scss';
import '../../common/alert-message.scss';

// to make API calls
import api from '../../../services/api';

import { QuestionnaireContext } from './Questionnaire';

import { Modal, Backdrop, Tooltip } from '@material-ui/core';

//COMPONENTS

//DynamicInput
import DynamicInput from '../../common/DynamicInput';

//SortableElement
import { SortableElement } from 'react-sortable-hoc';

// Modal de confirmación 
import AlertModal from '../../common/AlertModal';

// Alert
import Alert from '@material-ui/lab/Alert';

// DropzoneUploader
import DropzoneUploader from '../../common/DropzoneUploader';

//ICONS

//Icon Button
import IconButton from '@material-ui/core/IconButton';

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';

// Add image icon
import CropOriginalIcon from '@material-ui/icons/CropOriginal';

// Add new option icon
import AddCircleIcon from '@material-ui/icons/AddCircle';

// Delete option icon
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

//Save icon
import SaveIcon from '@material-ui/icons/Save';
import { Clear } from '@material-ui/icons';

const QuestionCard = SortableElement(({ value, forStudents }) => {

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
	const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	const { questionnaire, setQuestionsList } = useContext(QuestionnaireContext);

	// it opens the modal to delete a question
	const [openDeleteQuestion, setOpenDeleteQuestion] = useState(false);

	// it opens the modal to delete an option
	const [openDeleteOption, setOpenDeleteOption] = useState(false);

	// it opens the modal to upload an image
	const [openUploadImage, setOpenUploadImage] = useState(false);

	// To upload images
	const [upload, setUpload] = useState(false);

	//Question name
	const [question, setQuestion] = useState(value.question);

	const [optionsList, setOptionsList] = useState(value.options);

	const [selectedOption, setSelectedOption] = useState("");

	const [uploadImgFrom, setUploadImgFrom] = useState("");

	const btnSaveImage = useRef(null);

	useEffect(() => {
		if (upload) {
			setUpload(false);
		}
	}, [upload]);

	// Toggle of the modal to upload an image
	const toggle = () => setOpenUploadImage(!openUploadImage);

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

	const deleteOption = () => {
		if (questionnaire && selectedOption !== "") {
			api.delete(`/api/questionnaire/option/${questionnaire._id}/${value._id}/${selectedOption}`, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					showSuccess(res.data.message);
					setOptionsList(res.data.updatedQuestion.options);
					value.options = res.data.updatedQuestion.options; // Updating the options list with this
					setSelectedOption("");
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor inténtelo mas tarde");

					}
					setSelectedOption("");
				});
		}
		else {
			showError("¡Error inexperado, por favor inténtelo de nuevo mas tarde!");
		}
	}

	const deleteCard = () => {
		if (questionnaire) {
			api.delete(`/api/questionnaire/question/${questionnaire._id}/${value._id}`, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					showSuccess(res.data.message);
					setQuestionsList(res.data.updatedQuestionnaire.questions);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor inténtelo mas tarde");

					}
				});
		}
		else {
			showError("¡Error inexperado, por favor inténtelo de nuevo mas tarde!");
		}
	}

	const createOption = () => {
		if (questionnaire) {
			api.post(`/api/questionnaire/option/${questionnaire._id}/${value._id}`, {}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					setOptionsList([...optionsList, res.data.updatedQuestion.options[res.data.updatedQuestion.options.length - 1]]);
					value.options = [...optionsList, res.data.updatedQuestion.options[res.data.updatedQuestion.options.length - 1]]; // Updating the options list with this
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor inténtelo mas tarde");
					}
				})
		}
		else {
			showError("¡Error inexperado, por favor inténtelo de nuevo mas tarde!");
		}
	};

	const saveQuestion = () => {
		if (questionnaire) {
			api.put(`/api/questionnaire/question/${questionnaire._id}/${value._id}`, {
				question,
				options: optionsList
			}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					setQuestionsList(res.data.updatedQuestionnaire.questions);
					showSuccess(res.data.message);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor inténtelo mas tarde");
					}
				})
		}
		else {
			showError("¡Error inexperado, por favor inténtelo de nuevo mas tarde!");
		}
	};

	const uploadOptionImg = (files) => {
		if (files.length > 0 && questionnaire && selectedOption !== "") {
			btnSaveImage.current.disabled = true; // This is for avoid problems if the user press the button multiple times

			setInfo(true);
			setInfoMessage('Subiendo imagen de perfil al servidor...');

			const formData = new FormData(); //Crea un formulario
			formData.append('folder', 'questionnaire'); // Folder name to store the images
			formData.append('image', files[0]); //Añade un nombre al formulario
			const config = {
				headers: {
					'content-type': 'multipart/form-data', //Para aceptar archivos binarios
					'x-access-token': localStorage.getItem('token')
				}
			};
			//Make api call to upload image
			api.post(`/api/data/upload-questionnaire-img/option/${questionnaire._id}/${value._id}/${selectedOption}`, formData, config)
				.then((response) => {
					setOptionsList(response.data.updatedQuestion.options);
					setSelectedOption("");
					setInfo(false);
					setInfoMessage('');
					btnSaveImage.current.disabled = false;
					setOpenUploadImage(false);
				}).catch((error) => {
					setSelectedOption("");
					//Muestra errores durante el proceso
					showError("Ha ocurrido un error inexperado, por favor inténtelo mas tarde");
					setInfo(false);
					setInfoMessage('');
					btnSaveImage.current.disabled = false;
					setOpenUploadImage(false);
				});
		}
		else {
			if (files.length <= 0) {
				showError("¡Seleccione una imagen primero!");
			}
			else {
				showError("¡Error inexperado, por favor inténtelo de nuevo mas tarde!");
			}

		}
	}

	const uploadQuestionImg = (files) => {
		if (files.length > 0 && questionnaire) {
			btnSaveImage.current.disabled = true; // This is for avoid problems if the user press the button multiple times

			setInfo(true);
			setInfoMessage('Subiendo imagen de perfil al servidor...');

			const formData = new FormData(); //Crea un formulario
			formData.append('folder', 'questionnaire'); // Folder name to store the images
			formData.append('image', files[0]); //Añade un nombre al formulario
			const config = {
				headers: {
					'content-type': 'multipart/form-data', //Para aceptar archivos binarios
					'x-access-token': localStorage.getItem('token')
				}
			};
			//Make api call to upload image
			api.post(`/api/data/upload-questionnaire-img/question/${questionnaire._id}/${value._id}`, formData, config)
				.then((response) => {
					setQuestionsList(response.data.updatedQuestionnaire.questions);
					setInfo(false);
					setInfoMessage('');
					btnSaveImage.current.disabled = false;
					setOpenUploadImage(false);
				}).catch((error) => {
					//Muestra errores durante el proceso
					showError("Ha ocurrido un error inexperado, por favor inténtelo mas tarde");
					setInfo(false);
					setInfoMessage('');
					btnSaveImage.current.disabled = false;
					setOpenUploadImage(false);
				});
		}
		else {
			if (files.length <= 0) {
				showError("¡Seleccione una imagen primero!");
			}
			else {
				showError("¡Error inexperado, por favor inténtelo de nuevo mas tarde!");
			}
		}
	}

	const deleteQuestionImg = async () => {
		try {
			const response = await api.delete(`/api/data/delete-questionnaire-img/question/${questionnaire._id}/${value._id}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const questions = response.data.updatedQuestionnaire.questions;

			if (questions) {
				setQuestionsList(questions);
				showSuccess('Imagen borrada');
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.message);
			} else {
				showError("Un error ha ocurrido borrando la imagen");
			}
		}
	}

	const deleteOptionImg = async (optionId) => {
		try {
			const response = await api.delete(`/api/data/delete-questionnaire-img/option/${questionnaire._id}/${value._id}/${optionId}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

			const options = response.data.updatedQuestion.options;

			if (options) {
				setOptionsList(options);
				value.options = options; // Updating the options list with this
				showSuccess('Imagen borrada');
			}
		} catch (error) {
			console.log(error)
			if (error.response) {
				showError(error.response.message);
			} else {
				showError("Un error ha ocurrido borrando la imagen");
			}
		}
	}

	const updateQuestion = (question) => {
		setQuestion(question);

		// Updating the options list with this
		value.question = question;
		value.options = optionsList;
	};

	const questionInputStyle = {
		width: "100%",
		fontSize: "0.8em",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em",
		borderBottom: "solid",
		borderColor: "#ccc",
		borderWidth: '1px',
		margin: "0",
		fontWeight: "bold"
	};

	const optionInputStyle = {
		width: "100%",
		fontSize: "0.8em",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em",
	};

	const handleUpload = () => {
		setUpload(true);
	};

	const updateOption = (value, optionId) => {
		let found = false;

		let auxOptionsList = [...optionsList];
		for (let i = 0; i < auxOptionsList.length && !found; i++) {
			if (auxOptionsList[i]._id === optionId) {
				found = true;
				auxOptionsList[i].option = value;
			}
		}

		setOptionsList(auxOptionsList);
	};

	const handleSwitchIsCorrect = (optionId) => {

		let found = false;

		let auxOptionsList = [...optionsList];
		for (let i = 0; i < auxOptionsList.length && !found; i++) {
			if (auxOptionsList[i]._id === optionId) {
				found = true;
				auxOptionsList[i].isCorrect = !auxOptionsList[i].isCorrect;
			}
		}

		setOptionsList(auxOptionsList);
	};

	const handleUploadImg = (files) => {
		if (uploadImgFrom === 'question') {
			uploadQuestionImg(files);
			setUploadImgFrom("");
		}
		else if (uploadImgFrom === 'option') {
			uploadOptionImg(files);
			setUploadImgFrom("");
		}
	};

	return (
		<div className='question-card-container'>
			{success ?
				<Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
				: ""
			}
			{error ?
				<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
				: ""
			}

			<div className="question-info">
				<DynamicInput dynamicInputValue={question} dynamicInputStyle={questionInputStyle} sendValue={updateQuestion}></DynamicInput>

				<Tooltip enterDelay={200} enterNextDelay={200} title="Agregar imagen para la pregunta" aria-label="add-question-img">
					<IconButton
						className="question-button-uploader"
						color="primary"
						aria-label="Delete"
						onClick={() => {
							setUploadImgFrom("question");
							setOpenUploadImage(!openUploadImage);
						}}>
						<CropOriginalIcon />
					</IconButton>
				</Tooltip>
			</div>
			{value.image !== "" ?
				<div className='d-flex justify-content-center'>
					<div
						className='image-container'
					>
						<img className='question-image' src={`${process.env.REACT_APP_API_URL}/questionnaire/${value.image}`} alt="Question" />
						<Tooltip className={'ontouchstart' in window || navigator.msMaxTouchPoints ? 'delete-img-button-mobile' : 'delete-img-button'} title="Borrar imagen" aria-label="clean_filters">
							<IconButton onClick={deleteQuestionImg} size="small">
								<Clear />
							</IconButton>
						</Tooltip>
					</div>
				</div>
				: ""}

			{optionsList && optionsList.length > 0 ?
				optionsList.map((option) => {

					return (
						<div className="option-container">
							<div className="option-info">
								<Tooltip enterDelay={200} enterNextDelay={200} title="Marcar opción como correcta" aria-label="check-option">
									<div className={`check-option ${option.isCorrect ? 'active' : ''}`} onClick={() => handleSwitchIsCorrect(option._id)} />
								</Tooltip>
								<DynamicInput dynamicInputValue={option.option} dynamicInputStyle={optionInputStyle} sendValue={(value) => updateOption(value, option._id)} />
								<Tooltip enterDelay={200} enterNextDelay={200} title="Agregar imagen para la opción" aria-label="add-option-img">
									<IconButton
										className="option-info-icon"
										color="primary"
										aria-label="Delete"
										onClick={() => {
											setUploadImgFrom("option");
											setSelectedOption(option._id);
											setOpenUploadImage(!openUploadImage);
										}}>
										<CropOriginalIcon />
									</IconButton>
								</Tooltip>

								<Tooltip enterDelay={200} enterNextDelay={200} title="Eliminar opción" aria-label="delete-option">
									<IconButton
										className="option-info-icon"
										color="secondary"
										aria-label="Delete"
										onClick={() => {
											setSelectedOption(option._id);
											setOpenDeleteOption(!openDeleteOption);
										}}>
										<HighlightOffIcon />
									</IconButton>
								</Tooltip>
							</div>
							{option.image !== "" ?
								<div className='d-flex justify-content-center'>
									<div
										className='image-container'
									>
										<img className='option-image' src={`${process.env.REACT_APP_API_URL}/questionnaire/${option.image}`} alt="Option" />
										<Tooltip title="Borrar imagen" className={'ontouchstart' in window || navigator.msMaxTouchPoints ? 'delete-img-button-mobile' : 'delete-img-button'} aria-label="clean_filters">
											<IconButton onClick={() => deleteOptionImg(option._id)} size="small">
												<Clear />
											</IconButton>
										</Tooltip>
									</div>
								</div>
								: ""}

						</div>
					)
				})

				: ''}

			<button className="btn btn-light add-option-btn" onClick={createOption}>
				<AddCircleIcon className="add-icon" /> Añadir opción
			</button>

			{!forStudents ?
				<>
					<div className="delete-question-icon-container">
						<Tooltip enterDelay={200} enterNextDelay={200} title="Guardar datos de la pregunta" aria-label="add-question">
							<IconButton color="primary" aria-label="Save" onClick={saveQuestion}>
								<SaveIcon style={{ fontSize: 30 }} />
							</IconButton>
						</Tooltip>
						<Tooltip enterDelay={200} enterNextDelay={200} title="Eliminar pregunta" aria-label="delete-question">
							<IconButton color="secondary" aria-label="Delete" onClick={() => setOpenDeleteQuestion(!openDeleteQuestion)}>
								<DeleteIcon style={{ fontSize: 30 }} />
							</IconButton>
						</Tooltip>
					</div>

					<AlertModal
						type="delete"
						open={openDeleteQuestion}
						handleClose={() => setOpenDeleteQuestion(!openDeleteQuestion)}
						message='¿Está seguro que quiere eliminar esta pregunta?'
						action={deleteCard}
					/>
				</>
				: ""}

			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className='d-flex justify-content-center align-items-center'
				open={openUploadImage}
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
						onFormSubmit={handleUploadImg}
						upload={upload}
						type="image/jpeg, image/png, image/gif"
						maxFiles="1"
					/>

					<div className='d-flex justify-content-end'>
						<button onClick={handleUpload} ref={btnSaveImage} className='custom-btn custom-btn-primary p-2 mr-2'>Guardar imagen</button>
						<button onClick={toggle} className='custom-btn p-2'>Cancelar</button>
					</div>
				</div>
				{/* </Fade> */}
			</Modal>

			<AlertModal
				type="delete"
				open={openDeleteOption}
				handleClose={() => setOpenDeleteOption(!openDeleteOption)}
				message='¿Está seguro que quiere eliminar esta opción?'
				action={deleteOption}
			/>
		</div>
	)
});

export default QuestionCard;
