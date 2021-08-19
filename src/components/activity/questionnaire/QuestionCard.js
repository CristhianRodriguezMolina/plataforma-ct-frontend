import React, { useState, useEffect, useContext } from 'react';

//SCSS
import './QuestionCard.scss';
import '../../common/alert-message.scss';

// to make API calls
import api from '../../../services/api';

import { QuestionnaireContext } from './Questionnaire';

//COMPONENTS

//DynamicInput
import DynamicInput from '../../common/DynamicInput';

//SortableElement
import { SortableElement } from 'react-sortable-hoc';

// Modal de confirmación 
import AlertModal from '../../common/AlertModal';

// Alert
import Alert from '@material-ui/lab/Alert';

//ICONS

//Icon Button
import IconButton from '@material-ui/core/IconButton';

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';

// Add image icon
import CropOriginalIcon from '@material-ui/icons/CropOriginal';

// Add new option icon
import AddCircleIcon from '@material-ui/icons/AddCircle';

const QuestionCard = SortableElement(({ value, forStudents }) => {
	
    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	const { questionnaire, setQuestionsList } = useContext(QuestionnaireContext);

    // Variable de estado para el modal
    const [open, setOpen] = useState(false);

	const [question, setQuestion] = useState(value.question);

	const [optionsList, setOptionsList] = useState(value.options);

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

    const deleteCard = () => {
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

	const createOption = () => {
		if (questionnaire) {
			api.post(`/api/questionnaire/option/${questionnaire._id}/${value._id}`, { }, {
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

	const updateQuestion = (value) => {
		setQuestion(value);
	};

	const questionInputStyle = {
		width: "100%",
		fontSize: "0.8em",
		margin: "0.5em auto 0 auto",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em"
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
			

			<DynamicInput dynamicInputValue={question} dynamicInputStyle={questionInputStyle} sendValue={updateQuestion}></DynamicInput>


			<img src="https://picsum.photos/100/100" alt="image"/>

			<IconButton className="manage-buttons-container-1 m-0 p-0" color="primary" aria-label="Delete" onClick={() => setOpen(!open)}>
				<CropOriginalIcon />
			</IconButton>

			{optionsList && optionsList.length > 0 ?
				optionsList.map((option) => {

					return (
						<div>
							<div className="radio-group d-flex justify-conetent-start align-items-center">
								<input className="radio-button" type="radio" id="questionnaire" name="activity" value="questionnaire" />
								<label className="title-label" for="questionnaire">{option.option}</label>
							</div>

							<img src="https://picsum.photos/100/100" alt="image"/>
							<IconButton className="manage-buttons-container-1 m-0 p-0" color="primary" aria-label="Delete" onClick={() => setOpen(!open)}>
								<CropOriginalIcon />
							</IconButton>
						</div>
				)})
				
			: '' }

			<div className="create-card-button">
				<IconButton color="primary" aria-label="Create" onClick={createOption}>
					<AddCircleIcon style={{ fontSize: 25 }} />
				</IconButton>
			</div>

			{!forStudents ?
				<>
					<div className="manage-buttons-container">
						<IconButton className="manage-buttons-container-1 m-0 p-0" color="secondary" aria-label="Delete" onClick={() => setOpen(!open)}>
							<DeleteIcon />
						</IconButton>

					</div>
					<AlertModal
						type="delete"
						open={open}
						handleClose={() => setOpen(!open)}
						message='¿Esta seguro que quiere eliminar esta tarjeta?'
						action={deleteCard}
					/>
				</>
				: ""}
		</div>
	)
});

export default QuestionCard;
