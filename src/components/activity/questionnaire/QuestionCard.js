import React, { useState, useEffect, useContext } from 'react';

//SCSS
import './QuestionCard.scss';
import '../../common/alert-message.scss';

// to make API calls
import api from '../../../services/api';

import { QuestionnaireContext } from './Questionnaire';

import { Modal, Backdrop } from '@material-ui/core';

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

const QuestionCard = SortableElement(({ value, forStudents }) => {

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
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

	const [selectedOption, setSelectedOption] = useState(null);

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
		if(selectedOption) {
			api.delete(`/api/questionnaire/option/${questionnaire._id}/${value._id}/${selectedOption}`, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					showSuccess(res.data.message);
					setOptionsList(res.data.updatedQuestion.options);
					setSelectedOption(null);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");

					}
					setSelectedOption(null);
				});
		}
	}

	const deleteCard = () => {
		if(questionnaire) {
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
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");

					}
				});
		}
	}

	const createOption = () => {
		if (questionnaire) {
			api.post(`/api/questionnaire/option/${questionnaire._id}/${value._id}`, {}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					setOptionsList(res.data.updatedQuestion.options);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					}
				})
		}
	};

	const saveQuestion = () => {
		if(questionnaire) {
			api.put(`/api/questionnaire/question/${questionnaire._id}/${value._id}`, {
				question	
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
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					}
				})
		}
	};

	const updateQuestion = (value) => {
		setQuestion(value);
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
		for(let i = 0; i < auxOptionsList.length && !found; i++) {
			if(auxOptionsList[i]._id === optionId) {
				found = true;
				auxOptionsList[i].option = value;
			}
		}

		setOptionsList(auxOptionsList);

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

				<IconButton className="question-button-uploader" color="primary" aria-label="Delete" onClick={() => setOpenUploadImage(!openUploadImage)}>
					<CropOriginalIcon />
				</IconButton>
			</div>

			<img className='question-image' src="https://picsum.photos/100/100" alt="image" />

			{optionsList && optionsList.length > 0 ?
				optionsList.map((option) => {

					return (
						<div className="option-container">
						<div className="option-info">
							<div className={`check-option ${option.isCorrect ? 'active': ''}`} />
							<DynamicInput dynamicInputValue={option.option} dynamicInputStyle={optionInputStyle} sendValue={(value) => updateOption(value, option._id)}></DynamicInput>
								<IconButton
									className="option-info-icon"
									color="primary"
									aria-label="Delete"
									onClick={() => {
										setSelectedOption(option._id);
										setOpenUploadImage(!openUploadImage);
									}}>
									<CropOriginalIcon />
								</IconButton>

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
							</div>
							<img className="option-image" src="https://picsum.photos/100/100" alt="image" />

						</div>
					)
				})

				: ''}
			
			<button className="btn btn-light add-option-btn" onClick={createOption}>
				<AddCircleIcon className="add-icon"/> Añadir opción
			</button>

			{!forStudents ?
				<>
					<div className="delete-question-icon-container">
						<IconButton color="primary" aria-label="Delete" onClick={saveQuestion}>
							<SaveIcon style={{ fontSize: 30 }}/>
						</IconButton>
						<IconButton color="secondary" aria-label="Delete" onClick={() => setOpenDeleteQuestion(!openDeleteQuestion)}>
							<DeleteIcon style={{ fontSize: 30 }}/>
						</IconButton>
					</div>

					<AlertModal
						type="delete"
						open={openDeleteQuestion}
						handleClose={() => setOpenDeleteQuestion(!openDeleteQuestion)}
						message='¿Esta seguro que quiere eliminar esta pregunta?'
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
						onFormSubmit={() => console.log('hi')}
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

			<AlertModal
				type="delete"
				open={openDeleteOption}
				handleClose={() => setOpenDeleteOption(!openDeleteOption)}
				message='¿Esta seguro que quiere eliminar esta tarjeta?'
				action={deleteOption}
			/>
		</div>
	)
});

export default QuestionCard;
