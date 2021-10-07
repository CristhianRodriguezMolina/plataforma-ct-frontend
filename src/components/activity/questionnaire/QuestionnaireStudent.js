import React, { useState, useEffect, useContext, useRef } from 'react';

import { useParams, withRouter, Redirect } from "react-router-dom";

//API
import api from '../../../services/api';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

//SCSS
import './Questionnaire.scss';
import '../../common/alert-message.scss';

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



// Icons
import { Cancel, CheckCircle } from '@material-ui/icons';
// Alert modal
import AlertModal from '../../common/AlertModal';

const QuestionnaireStudent = (props) => {

	const { courseId } = useParams();

	//Store questionnaire data
	const [questionnaire, setQuestionnaire] = useState(null);
	const [answerQuestionsList, setAnswerQuestionsList] = useState(null);
	const [activity, setActivity] = useState(null);

	//Obtiene el progreso del estudiante
	const [studentActivity, setStudentActivity] = useState(null);

	const [loading, setLoading] = useState(true);

	const { changeColor, isAdmin, isTeacher } = useContext(UserContext);

	// MENSAJES DEL FORMULARIO
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio
	const [feedBack, setFeedBack] = useState(false); //Variable flag de feedback
	const [feedBackMessage, setFeedBackMessage] = useState(''); //Mensaje de feedback

	//Timer vars
	const [seconds, setSeconds] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [isActive, setIsActive] = useState(false);
	const [counter, setCounter] = useState(0);

	//Attempts number
	const [attemptsNumber, setAttemptsNumber] = useState(0);

	//To prevent api calls in the same time disabling the button
	const btnCheckAnswer = useRef(null);

	// Flag to open the completing modal
	const [openCompleting, setOpenCompleting] = useState(false);

	useEffect(() => {
		changeColor('#f8bbd0');
	});

	useEffect(() => {
		if (props.activity && props.inheritedActivity && props.studentActivity) {

			if (props.studentActivity.answer.length === props.inheritedActivity.questions.length) {
				setAnswerQuestionsList(props.studentActivity.answer);
				setCounter((parseInt(props.studentActivity.minutes) * 60) + parseInt(props.studentActivity.seconds));
				setAttemptsNumber(props.studentActivity.attempts);
			}
			else {
				setAnswerQuestionsList(shuffleArray(getQuestionsWithAnswer(props.inheritedActivity.questions), { 'copy': true }));
			}
			setQuestionnaire(props.inheritedActivity);
			setActivity(props.activity);
			setStudentActivity(props.studentActivity);
			setLoading(false);
			setIsActive(true);
		}
	}, [props.activity, props.inheritedActivity, props.studentActivity]);

	//handle the timer
	useEffect(() => {
		let intervalId;

		if (isActive) {
			intervalId = setInterval(() => {
				const secondsCounter = counter % 60;
				const minutesCounter = Math.floor(counter / 60);

				const computedSeconds = String(secondsCounter).length === 1 ? `0${secondsCounter}` : secondsCounter;
				const computedMinutes = String(minutesCounter).length === 1 ? `0${minutesCounter}` : minutesCounter;

				setSeconds(computedSeconds);
				setMinutes(computedMinutes);

				setCounter(counter => counter + 1);
			}, 1000);
		}

		return () => clearInterval(intervalId);

	}, [isActive, counter]);

	// Method to add the answer field to the options
	const getQuestionsWithAnswer = (questions) => {
		let questionsTemp = questions.slice()
		for (let i = 0; i < questionsTemp.length; i++) {
			let options = questionsTemp[i].options;

			let posibleAnswers = 0; // This variable is to count the number of possible correct answers for the question

			for (let j = 0; j < options.length; j++) {
				options[j] = { ...options[j], answer: false } // Adding a new field "answer" for the student to solve the questionnaire and later compare to the isCorrect field given by the activity

				if (options[j].isCorrect) {
					posibleAnswers += 1;
				}
			}

			questionsTemp[i] = { ...questionsTemp[i], posibleAnswers } // This is to add the number of possible correct answers to the question
		}
		return questionsTemp;
	}

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

	// Funcion para mostrar una alerta de feedback dado un mensaje
	const showFeedBack = (message) => {
		setFeedBack(true);   //Se cambia el estado de mensaje de feedback
		setFeedBackMessage(message); //Se setea el mensaje de feedback
	}

	const handleCompleteActivity = (complete) => {
		try {

			setAttemptsNumber(attemptsNumber + 1);

			if (studentActivity) {
				api.put(`/api/student-activity/${studentActivity._id}`, {
					complete,
					grade: 5,
					minutes,
					seconds,
					answer: answerQuestionsList,
					type: activity.type,
					attempts: (attemptsNumber + 1)
				}, {
					headers: {
						'x-access-token': localStorage.getItem('token')
					}
				})
					.then((res) => {
						if (complete) {
							setOpenCompleting(true);
							showSuccess(`¡Actividad realizada!`);
						}
						setStudentActivity(res.data.updatedStudentActivity);

						if (btnCheckAnswer.current) {
							btnCheckAnswer.current.disabled = false;
						}

					})
					.catch((err) => {
						if (err.response) {
							showError(err.response.data.message);
						}
						else {
							showError("¡Ha ocurrido un error guardando su nota!");
						}

						if (btnCheckAnswer.current) {
							btnCheckAnswer.current.disabled = false;
						}

					});
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.message);
			} else {
				showError('Hubo un error completando la actividad');
			}
		}
	}

	const checkAnswer = () => {

		if (btnCheckAnswer.current) {
			btnCheckAnswer.current.disabled = true;
		}

		setAttemptsNumber(attemptsNumber + 1);

		let goodQuestions = 0;

		for (let i = 0; i < answerQuestionsList.length; i++) {
			const answerOptionsList = answerQuestionsList[i].options.slice();

			for (let j = 0; j < answerOptionsList.length; j++) {
				if (answerOptionsList[j].isCorrect && answerOptionsList[j].answer) { // It compares the answer given by the student and the aswer given by the activity
					goodQuestions += 1;
					break;
				}
			}
		}

		// The grade it gets calculated on the number of good questions
		const grade = goodQuestions / answerQuestionsList.length * 5;

		if (grade === 5) {
			setIsActive(false);
			handleCompleteActivity(true);
		}
		else {
			handleCompleteActivity(false);
			showFeedBack(`Aún tienes ${answerQuestionsList.length - goodQuestions} respuesta(s) mal ¡Sigue intentando!`);
		}
	};

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
		fontSize: "1em",
		margin: "0.5em auto 0 auto",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em"
	};

	return (
		<>


			{error ?
				<Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
				: ""
			}
			{success ?
				<Alert className="alert-message" severity="success">{successMessage}</Alert>
				: ""
			}

			{/* MODAL TO SHOW THE FEEDBACK */}
			<AlertModal
				message={feedBackMessage}
				open={feedBack}
				handleClose={() => setFeedBack(false)}
				type='feedback'
				actionText='Vale, gracias'
				disableBackdropClick
			/>

			{/* MODAL TO HANDLE THE COMPLETING OF THE ACTIVITY */}
			<AlertModal
				message='Felicidades por terminar la actividad, volvamos a las unidades'
				open={openCompleting}
				handleClose={() => props.history.push(`/course/view/${courseId}/units-info`)} // With this the user gets redirect to the list of units
				type='feedback'
				actionText='Terminar'
				disableBackdropClick
			/>

			{!loading ?
				questionnaire && studentActivity ?
					<>
						<TitleCard
							title="Cuestionario"
							color="#FA61CD"
							colorFont="#FFF"
						/>
						<div className="questionnaire-container">
							<div className='questionnaire-info'>
								<h1 style={nameInputStyle} >{activity.name}</h1>
								<p style={desInputStyle} >{activity.description.trim() === '' ? 'Aquí iría la descripción... si tan solo tuviera una' : activity.description}</p>
								<div className='activity-attributes'>
									<div className="difficulty-grid-item">
										<p><b>Dificultad:</b> {util.getDifficulty(activity.difficulty)}</p>
									</div>
								</div>
							</div>

							{
								isAdmin || isTeacher ?
									<p>Respuesta del estudiante: </p>
									:
									studentActivity.complete ?
										<p>Tu respuesta:</p>
										: ""
							}

							<div className="questionnaire-body">
								{answerQuestionsList ?
									answerQuestionsList.map((value, index) => (
										<QuestionCardStudent
											key={`item-${index}`}
											questionnaire={questionnaire}
											answerQuestionsList={answerQuestionsList}
											setAnswerQuestionsList={setAnswerQuestionsList}
											index={index}
											value={value} />
									))
									: ""}
							</div>
							<hr className="hr-bar"></hr>
							<div className='d-flex justify-content-center'>
								{
									isAdmin || isTeacher ?

										studentActivity.complete ?
											<p className="d-flex justify-content-center aling-items-center"><CheckCircle style={{ color: "green", marginRight: "0.3em" }} />Completada</p> :
											<p className="d-flex justify-content-center aling-items-center"><Cancel style={{ color: "red", marginRight: "0.3em" }} />Sin completar</p>

										: <div>
											{
												!studentActivity.complete ?
													<button ref={btnCheckAnswer} onClick={checkAnswer} className="custom-btn custom-btn-success px-3 py-1 mt-2 mb-5">Aceptar</button> :
													<button className="custom-btn custom-btn-success px-3 py-1 mt-2 mb-5" disabled>Terminada</button>
											}
										</div>
								}

							</div>
						</div>
					</>
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

export default withRouter(QuestionnaireStudent);
