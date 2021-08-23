import React, { useState, useEffect, useContext } from 'react';

import { useParams, Redirect } from "react-router-dom";

//API
import api from '../../../services/api';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

//SCSS
import './Questionnaire.scss';
import '../../common/alert-message.scss';

//ArrayMove
import arrayMove from 'array-move';

// Shiffle array
import shuffleArray from 'shuffle-array';

// Util methods
import * as util from '../../../util/util';

//COMPONENTS

//QuestionCard
import QuestionCardStudent from './QuestionCardStudent';

// Title card
import TitleCard from '../../common/TitleCard';

// Alert
import Alert from '@material-ui/lab/Alert';

const QuestionnaireStudent = (props) => {

	//Store questionnaire data
	const [questionnaire, setQuestionnaire] = useState(null);
	const [questionsList, setQuestionsList] = useState(null);
	const [answerQuestionsList, setAnswerQuestionsList] = useState(null);
	const [activity, setActivity] = useState(null);

	//Obtiene el progreso del estudiante
	const [studentActivity, setStudentActivity] = useState(null);

	const [loading, setLoading] = useState(true);

	const { changeColor } = useContext(UserContext);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

	useEffect(() => {
		changeColor('#f8bbd0');
	});

	useEffect(() => {
		if (props.activity && props.inheritedActivity && props.studentActivity) {
			const questionsListTemp = shuffleArray(props.inheritedActivity.questions, { 'copy': true });

			setQuestionsList(questionsListTemp.slice());
			setAnswerQuestionsList(questionsListTemp.slice());
			setQuestionnaire(props.inheritedActivity);
			setActivity(props.activity);
			setStudentActivity(props.studentActivity);
			setLoading(false);
		}
	}, [props.activity, props.inheritedActivity, props.studentActivity]);

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
	}

	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	};

	useEffect(() => {
		console.log(answerQuestionsList)
		console.log(questionsList)
	}, [answerQuestionsList])

	const handleCompleteActivity = () => {
		try {
			let goodQuestions = 0;
			for (let i = 0; i < questionsList.length; i++) {
				const optionsList = questionsList[i].options;
				const answerOptionsList = answerQuestionsList[i].options;

				for (let j = 0; j < optionsList.length; j++) {
					console.log(optionsList[j], answerOptionsList[j])
					if (!(optionsList[j]._id === answerOptionsList[j]._id && optionsList[j].isCorrect === answerOptionsList[j].isCorrect)) {
						break;
					}
					if (j === optionsList.length - 1) {
						goodQuestions += 1;
					}
				}
			}

			const grade = goodQuestions / questionsList.length * 5;

			console.log(grade);
		} catch (error) {
			if (error.response) {
				showError(error.response.message);
			} else {
				showError('Hubo un error completando la actividad');
			}
		}
	}

	const nameInputStyle = {
		textAlign: "center",
		width: "80%",
		fontSize: "1.7em",
		margin: "0.5em auto 0 auto",
		padding: "0.4em",
		lineHeight: "1.2em",
		fontWeight: "600"
	};

	const desInputStyle = {
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
		<>
			<TitleCard
				title="Cuestionario"
				color="#FA61CD"
				colorFont="#FFF"
			/>

			{error ?
				<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
				: ""
			}
			{success ?
				<Alert className="alert-message" severity="success">{successMessage}</Alert>
				: ""
			}

			{!loading ?
				questionnaire && studentActivity ?
					<div className="questionnaire-container">
						<div className='questionnaire-info'>
							<h1 style={nameInputStyle} >{activity.name}</h1>
							<p style={desInputStyle} >{activity.description}</p>
							<div className='activity-attributes'>
								<div className="difficulty-grid-item">
									<p><b>Dificultad:</b> {util.getDifficulty(activity.difficulty)}</p>
								</div>
							</div>
						</div>

						<div className="questionnaire-body">
							{answerQuestionsList ?
								answerQuestionsList.map((value, index) => (
									<QuestionCardStudent key={`item-${index}`} questionnaire={questionnaire} answerQuestionsList={answerQuestionsList} setAnswerQuestionsList={setAnswerQuestionsList} forStudents={false} index={index} value={value} />
								))
								: ""}
						</div>
						<hr className="hr-bar"></hr>
						<div className='d-flex justify-content-center'>
							<button onClick={handleCompleteActivity} className="custom-btn custom-btn-success px-3 py-1 mt-2 mb-5">Aceptar</button>
						</div>
					</div>
					:
					<Redirect to="/unauthorized" />
				:

				<div className="spinner-loading">
					<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			}
		</>
	)
};

export default QuestionnaireStudent;
