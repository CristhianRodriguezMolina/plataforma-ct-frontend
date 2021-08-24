import React, { useState, useEffect } from 'react';

//SCSS
import './QuestionCard.scss';
import '../../common/alert-message.scss';

// to make API calls
import api from '../../../services/api';

import { Tooltip } from '@material-ui/core';

//COMPONENTS

// Alert
import Alert from '@material-ui/lab/Alert';

const QuestionCardStudent = (props) => {

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	//Question name
	const [question, setQuestion] = useState(null);

	// List of options
	const [optionsList, setOptionsList] = useState(null);

	useEffect(() => {
		if (!optionsList) {
			setQuestion(props.value.question);
			setOptionsList(props.value.options);
		}
	}, [optionsList]);

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

	const questionInputStyle = {
		width: "100%",
		fontSize: "1em",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500 bold",
		minHeight: "2.5em",
		borderBottom: "solid",
		borderColor: "#ccc",
		borderWidth: '1px',
		margin: "0",
	};

	const optionInputStyle = {
		width: "100%",
		fontSize: "0.9em",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em",
		margin: '0'
	};

	const updateQuestions = (options) => {
		let found = false;

		let auxQuestionsList = props.answerQuestionsList.slice();
		for (let i = 0; i < auxQuestionsList.length && !found; i++) {
			if (auxQuestionsList[i]._id === props.value._id) {
				found = true;
				auxQuestionsList[i].options = options;
			}
		}

		props.setAnswerQuestionsList(auxQuestionsList);
	};

	const handleSwitchIsCorrect = (optionId) => {

		let found = false;

		let auxOptionsList = optionsList.slice();
		for (let i = 0; i < auxOptionsList.length && !found; i++) {
			if (auxOptionsList[i]._id === optionId) {
				found = true;
				auxOptionsList[i].answer = !auxOptionsList[i].answer;
			}
		}

		setOptionsList(auxOptionsList);
		updateQuestions(auxOptionsList);
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
				<p style={questionInputStyle} >{props.value.question}</p>
			</div>
			{props.value.image !== "" ?
				<div className='d-flex justify-content-center mt-2'>
					<div
						className='image-container'
					>
						<img className='question-image' src={`${process.env.REACT_APP_API_URL}/questionnaire/${props.value.image}`} alt="Question" />
					</div>
				</div>
				: ""}

			{optionsList && optionsList.length > 0 ?
				<div className='row'>
					{
						optionsList.map((option, index) => {

							return (
								<div key={`item-${index}`} className="option-container option-container-student col-md-5" onClick={() => handleSwitchIsCorrect(option._id)}>
									<div className="option-info">
										<Tooltip enterDelay={200} enterNextDelay={200} title="Marcar opción como correcta" aria-label="check-option">
											<div className={`check-option ${option.answer ? 'active' : ''}`} />
										</Tooltip>
										<p style={optionInputStyle} >{option.option}</p>
									</div>
									{option.image !== "" ?
										<div className='d-flex justify-content-center'>
											<div
												className='image-container'
											>
												<img className='question-image' src={`${process.env.REACT_APP_API_URL}/questionnaire/${option.image}`} alt="Option" />
											</div>
										</div>
										: ""}

								</div>
							)
						})
					}
				</div>
				: ''}
		</div>
	)
};

export default QuestionCardStudent;
