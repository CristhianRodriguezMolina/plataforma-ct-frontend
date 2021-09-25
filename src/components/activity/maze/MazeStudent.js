import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams, Prompt, withRouter } from 'react-router-dom';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// API
import api from '../../../services/api';

// SCSS
import './maze.scss';

// Images
import robot from '../../../assets/robot.svg'

// Util methods
import * as util from '../../../util/util';

// COMPONENTS

// Instructions
import Intructions from './Intructions';

// Cell of the maze
import Cell from './Cell';

// Material UI core
import { Container } from '@material-ui/core';

// Icons
import { InfoOutlined, ZoomIn, ZoomOut } from '@material-ui/icons';

// Styled-components
import styled, { css, keyframes } from 'styled-components'

// Alert
import Alert from '@material-ui/lab/Alert';

// Timer
import TimerWorker from '../../common/timer.worker';

// Titulo
import TitleCard from '../../common/TitleCard';

// Alert modal
import AlertModal from '../../common/AlertModal';
import { ajaxSetup } from 'jquery';

const MazeStudent = (props) => {

	const { courseId } = useParams();

	// Variables del contexto
	const { changeColor } = useContext(UserContext);

	//Timer vars
	const [seconds, setSeconds] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [isActive, setIsActive] = useState(false);
	const [counter, setCounter] = useState(0);

	const [evaluateActivity, setEvaluateActivity] = useState(false);

	const [completed, setCompleted] = useState(false);


	const [isLeavingPage, setisLeavingPage] = useState(true);

	//Attempts number
	const [attemptsNumber, setAttemptsNumber] = useState(0);

	// MENSAJES DE LA VISTA
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio
	const [feedBack, setFeedBack] = useState(false); //Variable flag de feedback
	const [feedBackMessage, setFeedBackMessage] = useState(''); //Mensaje de feedback

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#f8bbd0');
	});

	// Funcion para mostrar una alerta satisfactoria dado un mensaje
	const showSuccess = (message) => {
		setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setSuccess(false);
			setSuccessMessage("");
		}, 2000)
	}

	// Funcion para mostrar una alerta de error dado un mensaje
	const showError = (message) => {
		setError(true);   //Se cambia el estado de mensaje de error a verdadero
		setErrorMessage(message); //Se setea el mensaje de error
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setError(false);
			setErrorMessage("");
		}, 2000)
	}

	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	}

	// Funcion para mostrar una alerta de feedback dado un mensaje
	const showFeedBack = (message) => {
		setFeedBack(true);   //Se cambia el estado de mensaje de feedback
		setFeedBackMessage(message); //Se setea el mensaje de feedback
	}

	// VARIABLES DEL MAZE -------------------------------------------------------------------------------------------------

	// GENERAL VARAIBLES 

	// Loading component while the maze is being fetching 
	const [loading, setLoading] = useState(true);

	// Flag to open the completing modal
	const [openCompleting, setOpenCompleting] = useState(false);

	// MAZE VARIABLES

	// The maze
	const [maze, setMaze] = useState(null);

	// Instructions to the animation
	const [instructions, setInstructions] = useState([]);

	//Student Activity
	const [studentActivity, setStudentActivity] = useState([]);

	// Size of the maze
	const [mazeSize, setMazeSize] = useState(0)
	const [mazeSizeOffset, setMazeSizeOffset] = useState(0);

	const [cols, setCols] = useState(5); // Num of columns of the maze
	const [rows, setRows] = useState(5); // Num of columns of the maze

	const [wX, setWX] = useState((mazeSize + mazeSizeOffset) / cols)
	const [wY, setWY] = useState((mazeSize + mazeSizeOffset) / rows)

	const [startX, setStartX] = useState(0); // Position of the start cell
	const [startY, setStartY] = useState(0); // Position of the end cell

	// Actions for render different things in the maze
	const actions = {
		BLOCK: 'BLOCK',
		EMPTY: 'EMPTY',
		START: 'START',
		END: 'END'
	}

	// Style classes
	const [mazeStyle, setMazeStyle] = useState({})

	// Data of the activity 
	const [activityName, setActivityName] = useState('Nombre de la actividad');
	const [activityDescription, setActivityDescription] = useState('Descripción de la actividad');

	const [timerWorker, setTimerWorker] = useState(new TimerWorker());


	useEffect(() => {
		if (timerWorker) {
			timerWorker.addEventListener("message", function (oEvent) {
				//Receive message from worker
				let data = oEvent.data;
				setMinutes(data.minutes);
				setSeconds(data.seconds);
				setEvaluateActivity(true);
			});
		}
	}, [timerWorker]);

	useEffect(() => {
		if (evaluateActivity) {
			handleCompleteActivity();
		}
	}, [evaluateActivity])

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

	// Maze container reference
	const ref = useRef(null)
	const setRef = useCallback(node => {
		if (ref.current) {
			// Make sure to cleanup any events/references added to the last instance
		}

		if (node) {
			setMazeSize(node.clientWidth); // This executes when mounting
		}

		// Save a reference to the node
		ref.current = node
	}, []);

	// Use effects ----------------------------------------------------------------------------------------------------------------------------------

	// UseEffect to init the maze activity data or to change the rows and cols
	useEffect(() => {
		if (!maze) {
			let counter = 0;
			if (props.studentActivity.attempts > 0) {
				setInstructions(props.studentActivity.answer);
				counter = (parseInt(props.studentActivity.minutes) * 60) + parseInt(props.studentActivity.seconds);
				setAttemptsNumber(props.studentActivity.attempts);
			}

			setMaze(props.inheritedActivity);
			setActivityName(props.activity.name); // Activity_id is the activity schema of the maze
			setActivityDescription(props.activity.description);
			setLoading(false); // This it to wait to the component to render completely
			setIsActive(true);
			setStudentActivity(props.studentActivity)



			//start timer
			timerWorker.postMessage(counter)
		} else if (maze) {
			setRows(maze.rows);
			setCols(maze.cols);
		}
	}, [maze]);

	// Si cambia la posicion del inicio se cambia la del robot y se reicinia la variable flag que muestra el robot
	useEffect(() => {
		setAnimate(false);
		setRobotX(startX);
		setRobotY(startY);
	}, [startX, startY])

	// Cada que el tamaño del maze cambia entonces actualiza los valores con base en el tamaño del maze
	useEffect(() => {
		if (maze) {
			setUp();
		}
	}, [maze, mazeSize, mazeSizeOffset]) // Execute setUp if the mazeSize changes

	// Cambia el tamaño del maze cada que cambia el tamaño de la pagina
	useEffect(() => {
		const setSize = () => {
			cancelAnimation(); // It cancels the animation in case of reload or resize the page
			setMazeSize(ref.current.clientWidth);
		}

		var rtime;
		var timeout = false;
		var delta = 200;

		const onResize = () => {
			rtime = new Date();
			if (timeout === false) {
				timeout = true;
				setTimeout(resizeend, delta);
			}
		}

		function resizeend() {
			if (new Date() - rtime < delta) {
				setTimeout(resizeend, delta);
			} else {
				timeout = false;
				setSize();
			}
		}

		window.addEventListener("beforeunload", setSize)
		window.addEventListener('resize', onResize)
		return () => {
			window.removeEventListener('beforeunload', setSize)
			window.removeEventListener('resize', onResize)
		}
	}, [])

	// Methods --------------------------------------------------------------------------------------------------------

	// Metodo para inicializar o actualizar los valores de tamaño del maze 
	const setUp = () => {
		setWX((mazeSize + mazeSizeOffset) / cols); // Width of each cell
		setWY((mazeSize + mazeSizeOffset) / rows); // Height of each cell

		setMazeStyle({
			width: `${(mazeSize + mazeSizeOffset)}px`,
			height: `${(mazeSize + mazeSizeOffset)}px`
		})
	}

	// Method to zoomin the maze
	const makeZoomIn = () => {
		if (!(mazeSize + mazeSizeOffset + 20 > mazeSize)) { // This if is to ensure that the maze doesnt grow bigger than the initial size
			cancelAnimation(); // Cancel any animation in case of resize the maze
			setMazeSizeOffset(mazeSizeOffset + 20);
		}
	}

	// Method to zoomout the maze
	const makeZoomOut = () => {
		cancelAnimation(); // Cancel any animation in case of resize the maze
		setMazeSizeOffset(mazeSizeOffset - 20);
	}

	// Restore the initial size of the maze
	const restoreSize = () => {
		cancelAnimation(); // Cancel any animation in case of resize the maze
		setMazeSizeOffset(0);
	}

	const getTime = () => {
		if (timerWorker) {
			timerWorker.postMessage('getTime');
		}
	};

	// Update the data of the maze in the DB
	const handleCompleteActivity = async () => {
		setProcess(true);
		setProcessMessage('Guardando cambios...');
		setAttemptsNumber(attemptsNumber + 1);
		if (props.studentActivity) {
			api.put(`/api/student-activity/${props.studentActivity._id}`, {
				complete: completed,
				grade: 5,
				minutes,
				seconds,
				answer: instructions,
				type: props.activity.type,
				attempts: (attemptsNumber + 1)
			}, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			})
				.then((res) => {
					if (completed) {
						setOpenCompleting(true);
						timerWorker.terminate();
						showSuccess(`¡Actividad realizada!`)
					}
					setStudentActivity(res.data.updatedStudentActivity);
					setEvaluateActivity(false);
				})
				.catch((err) => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Un error ha ocurrido resolviendo el laberinto");
					}
					setEvaluateActivity(false);
				});
		}
		setProcess(false);
		setProcessMessage('');
	}

	// ROBOT ANIMATION -------------------------------------------------------------------------------------------------------------------------

	// Variables for the animation
	const [animation, setAnimation] = useState('');

	// Animation parameters
	const [animationDuration, setAnimationDuration] = useState(5);
	const [animationRepeat, setAnimationRepeat] = useState(1);

	// Robot position and grades
	const [robotX, setRobotX] = useState(0);
	const [robotY, setRobotY] = useState(0);
	const [robotGrades, setRobotGrades] = useState(0)

	// Flag to set the animation state in the robot component as true
	const [animate, setAnimate] = useState(false);

	// Refs of the button that control the robot in the maze
	const btnProveMaze = useRef(null);
	const btnShowRobot = useRef(null);

	// The current type of the animation
	const [animationType, setAnimationType] = useState('NO_ANIMATION')
	const [animationExecutionType, setAnimationExecutionType] = useState('NO_ANIMATION')

	const [currentGrades, setCurrentGrades] = useState(0)
	const [currentTop, setCurrentTop] = useState(startY)
	const [currentLeft, setCurrentLeft] = useState(startX)
	const [errorMazeMessage, setErrorMazeMessage] = useState('')

	// Message that gonna be show to the user if there is an error to show it feedback
	const [feedbackMazeMessage, setFeedbackMazeMessage] = useState('');

	// Variable to set if the confimation alert to finalize the maze is open or not
	const [isOpenFinalization, setIsOpenFinalization] = useState(false);

	// Variables to save the timeouts id in case of cancelation
	const [createAnimationTimeout, setCreateAnimationTimeout] = useState(null);

	// Character Robot, with styled-components
	const Robot = styled.div`
		background-image: url(${robot});
		background-size: 100% 100%;
		position: absolute;
		left: ${robotX}px;
		top: ${robotY}px;
		transform: rotate(${robotGrades}deg);
		width: ${wX}px;
		height: ${wY}px;
		align-self: center;
		transition-duration: 1s;
		z-index: 1000;
		animation: ${props =>
			props.animate &&
			css`
			  ${animation} ${props.animationDuration}s linear ${props.animationRepeat}
			`};
	`

	// To get a cell with the i j position given
	const getCell = (i, j) => {
		for (let index = 0; index < maze.cells.length; index++) {
			const cell = maze.cells[index];
			if (cell.i === i && cell.j === j) {
				return cell;
			}
		}
		return {
			type: 'NOT_EXIST',
		}
	}

	// UseEffect for animation
	useEffect(() => {
		if (animationExecutionType === 'RUNNING' && animationType === 'NO_ANIMATION') {
			createAnimation();
		} else if (animationExecutionType === 'RUNNING' && animationType !== 'NO_ANIMATION') {
			finishAnimation();
		}
	}, [animationExecutionType, animationType])

	const createAnimation = async () => {

		if (!animate) {
			showInfo('Primero active el Robot!!')
			return;
		}

		if (instructions.length <= 0) {
			showInfo('Primero ponga alguna instrucción!!')
			return;
		}

		// While the animation is excuting then the button to active the animation and the button to show the robot are disabled
		btnProveMaze.current.disabled = true;
		btnShowRobot.current.disabled = true;

		// Reset the animation
		setAnimationDuration(5);
		setAnimationRepeat(1);

		// Reset the robot position
		setRobotX(startX);
		setRobotY(startY);
		setRobotGrades(0);

		// Actions passed for the user
		const frameActions = instructions;

		// Start of the animation
		var stringKeyFrame = `from{
			left: ${startX}px;
			top: ${startY}px;
			transform: rotate(0deg)
		}`;

		var animateDuration = 5;

		// Current direction and grades of the ROBOT
		var currentDirection = 'UP';
		var currentGrades = 0;

		// Current top (X) and left (Y) of the ROBOT
		var currentLeft = startX;
		var currentTop = startY;

		// Message that gonna be show to the user if there is an error
		var errorMazeMessage = '';

		// Flag to see if there is an error in the path of the maze
		var isError = false;

		// Flag to see if there is a win in the path of the maze
		var isWin = false;

		// Number of cells that can be traveled
		var usableCells = frameActions.length;

		// In this for the cells are analyzed to define the broke or end number or iterations to create the animation
		for (let i = 0; i < frameActions.length; i++) {

			// Current action to be analized and processed
			const action = frameActions[i].type;

			if (action === 'FORWARD') { // IF THE ACTION IS GO FORWARD
				if (currentDirection === 'UP') {
					currentTop -= wY;
				} else if (currentDirection === 'DOWN') {
					currentTop += wY;
				} else if (currentDirection === 'RIGHT') {
					currentLeft += wX;
				} else if (currentDirection === 'LEFT') {
					currentLeft -= wX;
				}
			} else if (action === 'RIGHT') { // IF THE ACTION IS TURN RIGHT
				if (currentDirection === 'UP') {
					currentDirection = 'RIGHT';
				} else if (currentDirection === 'RIGHT') {
					currentDirection = 'DOWN';
				} else if (currentDirection === 'DOWN') {
					currentDirection = 'LEFT';
				} else if (currentDirection === 'LEFT') {
					currentDirection = 'UP';
				}

				currentGrades = currentGrades + 90;

			} else if (action === 'LEFT') { // IF THE ACTION IS TURN LEFT
				if (currentDirection === 'UP') {
					currentDirection = 'LEFT';
				} else if (currentDirection === 'RIGHT') {
					currentDirection = 'UP';
				} else if (currentDirection === 'DOWN') {
					currentDirection = 'RIGHT';
				} else if (currentDirection === 'LEFT') {
					currentDirection = 'DOWN';
				}

				currentGrades = currentGrades - 90;
			}

			// Current cell of the animation to be analized
			const currentCell = getCell(Math.round(currentLeft / wX), Math.round(currentTop / wY));

			// If the path is the END of the maze then set a win and comes out of the for
			if (currentCell.type === actions.END) {
				usableCells = i + 1;
				isWin = true;

				animateDuration = (i + 1) * 0.5;
				setAnimationDuration(animateDuration);
				break;
			}

			// If the path is blocked then set a error and comes out of the for
			if (currentCell.type === actions.BLOCK || currentCell.type === 'NOT_EXIST' || i === frameActions.length - 1) {
				usableCells = i + 1;

				if (currentCell.type === actions.BLOCK) {
					errorMazeMessage = 'El robot choco con una pared';
					setFeedbackMazeMessage('Revisa tus instrucciones, parece que tienes errores');
				} else if (currentCell.type === 'NOT_EXIST') {
					errorMazeMessage = 'El robot se cayo del laberinto';
					setFeedbackMazeMessage('Revisa tus instrucciones, parece que tienes errores');
				} else if (i === frameActions.length - 1) {
					errorMazeMessage = 'No se encontró el final del laberinto';
					setFeedbackMazeMessage('Revisa tus instrucciones, parece que no son suficientes');
				}

				isError = true;

				animateDuration = (i + 1) * 0.5;
				setAnimationDuration(animateDuration);
				break;
			}
		}

		setRobotX(currentLeft);
		setRobotY(currentTop);
		setRobotGrades(currentGrades);

		// SET NEWLY THE VARIABLES CURRENT TOP, LEFT AND DIRECTION TO THE INITIAL VALUE
		currentDirection = 'UP';
		currentLeft = startX;
		currentTop = startY;
		currentGrades = 0;

		// Current percent of the animation and the offset 
		const percentOffset = Math.floor(100 / usableCells);
		var currentPercent = percentOffset;

		// In this for the animation is created, having in count the before for to analize the cells
		for (let i = 0; i < usableCells; i++) {

			// Current action to be analized and processed
			const action = frameActions[i].type;

			if (action === 'FORWARD') { // IF THE ACTION IS GO FORWARD
				if (currentDirection === 'UP') {
					stringKeyFrame += `${currentPercent}% {
						top: ${currentTop - wY}px;
						left: ${currentLeft}px;
						transform: rotate(${currentGrades}deg)
					}`;
					currentTop -= wY;
				} else if (currentDirection === 'DOWN') {
					stringKeyFrame += `${currentPercent}% {
						top: ${currentTop + wY}px;
						left: ${currentLeft}px;
						transform: rotate(${currentGrades}deg)
					}`;
					currentTop += wY;
				} else if (currentDirection === 'RIGHT') {
					stringKeyFrame += `${currentPercent}% {
						top: ${currentTop}px;
						left: ${currentLeft + wX}px;
						transform: rotate(${currentGrades}deg)
					}`;
					currentLeft += wX;
				} else if (currentDirection === 'LEFT') {
					stringKeyFrame += `${currentPercent}% {
						top: ${currentTop}px;
						left: ${currentLeft - wX}px;
						transform: rotate(${currentGrades}deg)
					}`;
					currentLeft -= wX;
				}
			} else if (action === 'RIGHT') { // IF THE ACTION IS TURN RIGHT
				if (currentDirection === 'UP') {
					currentDirection = 'RIGHT';
				} else if (currentDirection === 'RIGHT') {
					currentDirection = 'DOWN';
				} else if (currentDirection === 'DOWN') {
					currentDirection = 'LEFT';
				} else if (currentDirection === 'LEFT') {
					currentDirection = 'UP';
				}

				stringKeyFrame += `${currentPercent}% {
					top: ${currentTop}px;
					left: ${currentLeft}px;
					transform: rotate(${currentGrades + 90}deg)
				}`;

				currentGrades = currentGrades + 90;

			} else if (action === 'LEFT') { // IF THE ACTION IS TURN LEFT
				if (currentDirection === 'UP') {
					currentDirection = 'LEFT';
				} else if (currentDirection === 'RIGHT') {
					currentDirection = 'UP';
				} else if (currentDirection === 'DOWN') {
					currentDirection = 'RIGHT';
				} else if (currentDirection === 'LEFT') {
					currentDirection = 'DOWN';
				}

				stringKeyFrame += `${currentPercent}% {
					top: ${currentTop}px;
					left: ${currentLeft}px;
					transform: rotate(${currentGrades - 90}deg)
				}`;

				currentGrades = currentGrades - 90;
			}

			// Increase the current percent with the offset
			currentPercent += percentOffset;
		}

		// Final step of the animation
		stringKeyFrame += `
			to{
				top: ${currentTop}px;
				left: ${currentLeft}px;
				transform: rotate(${currentGrades}deg);
			}
		`

		// Set the created animation
		setAnimation(keyframes`
		  	${stringKeyFrame}
		`);

		// ERROR AND WIN ANIMATION EXECUTIONS; AND SAVING THE TIME ID, IN CASE OF CANCELATION
		setCreateAnimationTimeout(setTimeout(() => {
			setCurrentTop(currentTop);
			setCurrentLeft(currentLeft);
			setCurrentGrades(currentGrades);
			setErrorMazeMessage(errorMazeMessage);

			if (isWin) {
				setAnimationType('WIN');
			} else if (isError) {
				setAnimationType('ERROR');
			}
		}, animateDuration * 1000))
	}

	// This method executes the finish animation (Win, Error) when the animation throught the maze ends
	const finishAnimation = () => {
		// If the animation is canceled
		if (animationExecutionType === 'NO_ANIMATION' || animate === false) {
			return;
		}

		if (animationType === 'ERROR') {
			// setMaze(prevMaze => {
			// 	return { ...prevMaze, verified: false }
			// })
			showError(errorMazeMessage);
		}

		if (animationType === 'WIN') {
			// setMaze(prevMaze => {
			// 	return { ...prevMaze, verified: true }
			// })
			showSuccess('Felicidades completaste el laberinto')
		}

		const winAnimation = `
			from{
				top: ${currentTop}px;
				left: ${currentLeft}px;
				-webkit-transform: scale3d(1, 1, 1) rotate(${currentGrades}deg);
				transform: scale3d(1, 1, 1) rotate(${currentGrades}deg);
			}

			50% {
				top: ${currentTop}px;
				left: ${currentLeft}px;
				-webkit-transform: scale3d(1.5) rotate(${currentGrades + 180}deg);
				transform: scale3d(1.5) rotate(${currentGrades + 180}deg);
			}

			to {
				top: ${currentTop}px;
				left: ${currentLeft}px;
				-webkit-transform: scale3d(1, 1, 1) rotate(${currentGrades + 360}deg);
				transform: scale3d(1, 1, 1) rotate(${currentGrades + 360}deg);
			}
		`

		// Animation error for any crash or if the robot get out the maze
		const errorAnimation = `
		from {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(1, 1, 1) rotate(${currentGrades}deg);
			transform: scale3d(1, 1, 1) rotate(${currentGrades}deg);
		  }
		
		  30% {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(1.25, 0.75, 1) rotate(${currentGrades}deg);
			transform: scale3d(1.25, 0.75, 1) rotate(${currentGrades}deg);
		  }
		
		  40% {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(0.75, 1.25, 1) rotate(${currentGrades}deg);
			transform: scale3d(0.75, 1.25, 1) rotate(${currentGrades}deg);
		  }
		
		  50% {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(1.15, 0.85, 1) rotate(${currentGrades}deg);
			transform: scale3d(1.15, 0.85, 1) rotate(${currentGrades}deg);
		  }
		
		  65% {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(0.95, 1.05, 1) rotate(${currentGrades}deg);
			transform: scale3d(0.95, 1.05, 1) rotate(${currentGrades}deg);
		  }
		
		  75% {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(1.05, 0.95, 1) rotate(${currentGrades}deg);
			transform: scale3d(1.05, 0.95, 1) rotate(${currentGrades}deg);
		  }
		
		  to {
			top: ${currentTop}px;
			left: ${currentLeft}px;
			-webkit-transform: scale3d(1, 1, 1) rotate(${currentGrades}deg);
			transform: scale3d(1, 1, 1) rotate(${currentGrades}deg);
		  }
		`

		setAnimationDuration(1);
		setAnimationRepeat(2);

		setAnimation(keyframes`
					  ${animationType === 'WIN' ? winAnimation : errorAnimation}
					`);

		setTimeout(() => {
			setRobotX(startX);
			setRobotY(startY);
			setRobotGrades(0);

			setAnimation(``);
			setAnimate(false);

			setAnimationExecutionType('NO_ANIMATION');
			setAnimationType('NO_ANIMATION');

			// Feedbacks for the maze
			if (instructions.length > maze.instructions.length && animationType === 'WIN') {
				setIsOpenFinalization(true);
			} else if (animationType === 'WIN') {
				setCompleted(true);
				getTime();
			} if (animationType === 'ERROR') { // THIS ID IS TO SHOW A FEEDBACK MESSAGE IF THERE IS A ERROR IN THE INSTRUCTIONS
				showFeedBack(feedbackMazeMessage);
				setCompleted(false);
				getTime();
			}

			// When the animation ends then the button to prove the maze and the button to show the robot are activated
			btnProveMaze.current.disabled = false;
			btnShowRobot.current.disabled = false;
		}, 2000)
	}

	const cancelAnimation = () => {

		if (animate) { // If there is an animation then cancel set the animation type to canceled, in other case just set the buttons to disabled = false, just in case
			clearTimeout(createAnimationTimeout);

			setAnimationExecutionType('NO_ANIMATION');
			setAnimationType('NO_ANIMATION');

			setAnimation(``);
			setAnimate(false);
			setAnimationDuration(0);
			setRobotX(startX);
			setRobotY(startY);
			setRobotGrades(0);

			// When the animation ends then the button to prove the maze and the button to show the robot are activated
			btnProveMaze.current.disabled = false;
			btnShowRobot.current.disabled = false;
		}
	}

	const handleShowRobot = () => {
		setAnimate(!animate);

		setAnimation(``);
		setAnimationExecutionType('NO_ANIMATION');
		setAnimationType('NO_ANIMATION');
	}

	return (
		<div className='mb-5'>
			<Prompt
				when={isLeavingPage}
				message={() => {
					if (timerWorker) {
						timerWorker.terminate();
					}
				}} />
			{!loading ?
				<>
					{
						success ?
							<Alert className="alert-message" severity="success">{successMessage}</Alert>
							: ""
					}

					{
						error ?
							<Alert className="alert-message" severity="error">{errorMessage}</Alert>
							: ""
					}

					{
						process ?
							<Alert className="alert-message" severity="info">{processMessage}</Alert>
							: ""
					}

					<TitleCard
						title="Laberinto"
						color="#FA61CD"
						colorFont="#FFF"
					/>

					{/* MODAL TO SHOW THE FEEDBACK */}
					<AlertModal
						message={feedBackMessage}
						open={feedBack}
						handleClose={() => setFeedBack(false)}
						type='feedback'
						actionText='Vale, gracias'
						disableBackdropClick
					/>

					{/* MODAL TO HANDLE THE FINISHING OF THE MAZE ACTIVITY */}
					<AlertModal
						message='Completaste el laberinto, pero podrias completarlo con menos instrucciones, ¿Quieres intentarlo?'
						open={isOpenFinalization}
						actionClose={() => { //closingText action handler
							setCompleted(true)
							getTime();
						}}
						action={() => { //actionText action handler
							setCompleted(false)
							getTime();
						}}
						handleClose={() => setIsOpenFinalization(!isOpenFinalization)} // to close the modal
						type='success'
						actionText='¡Intentemoslo!'
						closingText='No, gracias'
						disableBackdropClick
					/>

					{/* MODAL TO HANDLE THE COMPLETING OF THE ACTIVITY */}
					<AlertModal
						message='Felicidades por terminar la actividad, volvamos a las unidades'
						open={openCompleting}
						handleClose={() => props.history.push(`/course/view/${courseId}/units-info`)}
						type='feedback'
						actionText='Terminar'
						disableBackdropClick
					/>

					<div className="maze-header">
						<Container maxWidth='md'>
							{/* GENERAL DATA OF THE MAZE */}
							<div>
								<h1 style={nameInputStyle} >{activityName}</h1>
								<p style={desInputStyle} >{activityDescription.trim() === '' ? 'Aqui iría la descripción... si tan solo tuviera una' : activityDescription}</p>
								<div className='activity-attributes'>
									<div className="difficulty-grid-item">
										<p><b>Dificultad:</b> {util.getDifficulty(props.activity.difficulty)}</p>
									</div>
								</div>
							</div>
							<hr />

							{studentActivity ?
								!studentActivity.complete ?

									<div className='d-flex flex-wrap justify-content-around align-items-center'>
										{/* BUTTONS TO REDUCE OR ENLARGE THE MAZE */}
										<div className='d-flex flex-column'>
											<h1 className='h4 mb-4'>Cambiar tamaño del maze</h1>
											<div>
												<button onClick={makeZoomIn} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomIn /></button>
												<button onClick={makeZoomOut} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomOut /></button>
												<button onClick={restoreSize} className="custom-btn custom-btn-search p-2">Restablecer</button>
											</div>
										</div>

										{/* BUTTONS TO MANIPULATE THE MAZE ANIMATION */}
										<div className='mt-4 d-flex justify-content-center'>
											<button onClick={() => { setAnimationExecutionType('RUNNING'); setAnimationType('NO_ANIMATION') }} className='custom-btn custom-btn-success p-2 mr-2' ref={btnProveMaze} >Ejecutar</button>
											<button onClick={handleShowRobot} className='custom-btn custom-btn-primary p-2 mr-2' ref={btnShowRobot} >Mostrar/Ocultar robot</button>
											<button onClick={cancelAnimation} className='custom-btn custom-btn-search p-2' >Cancelar animación</button>
										</div>
									</div> :
									<p>Actividad terminada<br />Tu respuesta: </p>
								: ""}
							<hr />
						</Container>
					</div>

					<div className='row py-4 w-100 mx-auto'>
						<div className='col-md-6'>
							{/* MAZE */}
							<div className='maze-container' ref={setRef}>
								<div className='maze' style={mazeStyle}>
									{
										maze ?
											<>

												{
													maze.cells.map(cell => (
														<Cell
															key={`'${cell.i}${cell.j}'`}
															cell={cell}
															wX={wX}
															wY={wY}
															actions={actions}
															setStartX={setStartX}
															setStartY={setStartY}
														>
														</Cell>
													))
												}

											</>
											:
											<>
											</>
									}

									{/* CHARACTER */}
									{
										animate &&
										<Robot
											wX={wX}
											wY={wY}
											animate={animate}
											animationDuration={animationDuration}
											animationRepeat={animationRepeat}
										/>
									}
								</div>
							</div>
						</div>

						<div className='col-md-6 mt-md-0 mt-4'>
							{
								maze ?
									<Intructions instructions={instructions} setInstructions={setInstructions} cols={cols} rows={rows} />
									: ''
							}
						</div>

					</div>
				</>
				: ''
			}
		</div >
	)
}

export default withRouter(MazeStudent);