import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// API
import api from '../../../services/api';

// SCSS
import './maze.scss';

// Images
import robot from '../../../assets/robot.svg'

// COMPONENTS

// Instructions
import Intructions from './Intructions';

// Cell of the maze
import Cell from './Cell';

// Material UI core
import { Container } from '@material-ui/core';

// Icons
import { ZoomIn, ZoomOut } from '@material-ui/icons';

// Styled-components
import styled, { css, keyframes } from 'styled-components'

// Alert
import Alert from '@material-ui/lab/Alert';

export default function MazeStudent(props) {

	// Variables del contexto
	const { changeColor } = useContext(UserContext);

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

	// VARIABLES DEL MAZE -------------------------------------------------------------------------------------------------

	// GENERAL VARAIBLES 

	// Param variables
	const { activityId } = useParams();

	// Loading component while the maze is being fetching 
	const [loading, setLoading] = useState(true);

	// MAZE VARIABLES

	// The maze
	const [maze, setMaze] = useState(null);

	// Instructions to the animation
	const [instructions, setInstructions] = useState([]);

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
			console.log(props)
			setMaze(props.inheritedActivity);
			setActivityName(props.activity.name); // Activity_id is the activity schema of the maze
			setActivityDescription(props.activity.description);
			setLoading(false); // This it to wait to the component to render completely
		} else {
			setRows(maze.rows);
			setCols(maze.cols);
		}
	}, [maze])

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

	// Fetch maze data
	const fetchMaze = () => {
		api.get(`/api/maze/${activityId}`, {
			headers: { 'x-access-token': localStorage.getItem('token') }
		})
			.then((res) => {
				setMaze(res.data);
				setActivityName(res.data.activity_id.name); // Activity_id is the activity schema of the maze
				setActivityDescription(res.data.activity_id.description);
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido obtener el laberinto, por favor intentelo mas tarde!");
				}
			})
	}

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

	// Update the data of the maze in the DB
	const handleCompleteActivity = async (grade) => {
		setProcess(true);
		setProcessMessage('Guardando cambios...');

		if (props.studentActivity) {
			api.put(`/api/student-activity/${props.studentActivity._id}`, {
				complete: true,
				grade: grade
			}, {
				headers: {
					'x-access-token': localStorage.getItem('token')
				}
			})
				.then((res) => {
					showSuccess(`Actividad realizada, su calificación es: ${res.data.updatedStudentActivity.grade}`)
				})
				.catch((err) => {
					if (err.response) {
						console.log(err.response.data.message);
						showError(err.response.data.message);
					}
					else {
						console.log(`Un error ha ocurrido resolviendo el laberinto: ${error}`);
						showError(`Un error ha ocurrido resolviendo el laberinto: ${error}`);
					}
				});
		}
		setProcess(false);
		setProcessMessage('');
	}

	// ROBOT ANIMATION -------------------------------------------------------------------------------------------------------------------------

	// Variables for the animation
	const [animation, setAnimation] = useState('');

	// Animation parameters
	const [animationDuration, setAnimationDuration] = useState('5s');
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

	const [animationType, setAnimationType] = useState('NO_ANIMATION')

	const [currentGrades, setCurrentGrades] = useState(0)
	const [currentTop, setCurrentTop] = useState(startY)
	const [currentLeft, setCurrentLeft] = useState(startX)
	const [errorMazeMessage, setErrorMazeMessage] = useState('')

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
			  ${animation} ${props.animationDuration} linear ${props.animationRepeat}
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
		if (animationType !== 'NO_ANIMATION') {
			finishAnimation();
		}
	}, [animationType])

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
		setAnimationDuration('5s');
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
				setAnimationDuration(`${animateDuration}s`);
				break;
			}

			// If the path is blocked then set a error and comes out of the for
			if (currentCell.type === actions.BLOCK || currentCell.type === 'NOT_EXIST' || i === frameActions.length - 1) {
				usableCells = i + 1;

				if (currentCell.type === actions.BLOCK) {
					errorMazeMessage = 'El robot choco con una pared';
				} else if (currentCell.type === 'NOT_EXIST') {
					errorMazeMessage = 'El robot se cayo del laberinto';
				} else if (i === frameActions.length - 1) {
					errorMazeMessage = 'No se encontró el final del laberinto';
				}

				isError = true;

				animateDuration = (i + 1) * 0.5;
				setAnimationDuration(`${animateDuration}s`);
				break;
			}
		}

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

		setRobotX(currentLeft);
		setRobotY(currentTop);
		setRobotGrades(currentGrades);

		// ERROR AND WIN ANIMATION EXECUTIONS
		setTimeout(() => {
			if (animationType !== 'CANCELED') {
				setCurrentTop(currentTop);
				setCurrentLeft(currentLeft);
				setCurrentGrades(currentGrades);
				setErrorMazeMessage(errorMazeMessage);

				if (isWin) {
					setAnimationType('WIN');
				} else if (isError) {
					setAnimationType('ERROR');
				}
			}
		}, animateDuration * 1000)
	}

	// This method executes the finish animation (Win, Error) when the animation throught the maze ends
	const finishAnimation = () => {
		// If the animation is canceled
		if (animationType === 'CANCELED' || animate === false) {
			showInfo('Animacion cancelada');
			setAnimationType('NO_ANIMATION');
			return;
		}

		if (animationType === 'ERROR') {
			setMaze(prevMaze => {
				return { ...prevMaze, verified: false }
			})
			console.log('Hubo un error en el camino del maze')
			showError(errorMazeMessage);
		}

		if (animationType === 'WIN') {
			setMaze(prevMaze => {
				return { ...prevMaze, verified: true }
			})
			console.log('Felicidades completaste el laberinto')
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

		setAnimationDuration('1s');
		setAnimationRepeat(5);

		setAnimation(keyframes`
					  ${animationType === 'WIN' ? winAnimation : errorAnimation}
					`);

		setTimeout(() => {
			// Update the maze when executes any instructions
			handleCompleteActivity(animationType === 'WIN' ? 5 : 0);

			setRobotX(startX);
			setRobotY(startY);
			setRobotGrades(0);

			setAnimation(``);
			setAnimate(false);

			// When the animation ends then the button to prove the maze and the button to show the robot are activated
			btnProveMaze.current.disabled = false;
			btnShowRobot.current.disabled = false;
		}, 5000)

		setAnimationType('NO_ANIMATION');
	}

	const cancelAnimation = () => {

		if (animate) { // If there is an animation then cancel set the animation type to canceled, in other case just set the buttons to disabled = false, just in case
			setAnimationType('CANCELED');

			setAnimation(``);
			setAnimate(false);
			setAnimationDuration('0s');
			setRobotX(startX);
			setRobotY(startY);
			setRobotGrades(0);
		}

		// When the animation ends then the button to prove the maze and the button to show the robot are activated
		btnProveMaze.current.disabled = false;
		btnShowRobot.current.disabled = false;
	}

	const handleShowRobot = () => {
		setAnimate(!animate)
	}

	return (
		<div className='mb-5'>
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
					<div className="maze-header">
						<Container maxWidth='md'>
							{/* GENERAL DATA OF THE MAZE */}
							<div>
								<h1 style={nameInputStyle} >{activityName}</h1>
								<p style={desInputStyle} >{activityDescription}</p>
							</div>
							<hr />
							<div className='d-flex justify-content-around align-items-center'>
								{/* BUTTONS TO MANIPULATE THE MAZE ANIMATION */}
								<div className='mt-4 d-flex justify-content-center'>
									<button onClick={() => createAnimation()} className='custom-btn custom-btn-success p-2 mr-2' ref={btnProveMaze} >Ejecutar</button>
									{/* <button onClick={cleanMaze} className="custom-btn custom-btn-delete p-2 mr-2">Limpiar maze</button> */}
									<button onClick={handleShowRobot} className='custom-btn custom-btn-primary p-2 mr-2' ref={btnShowRobot} >Mostrar/Ocultar robot</button>
									<button onClick={cancelAnimation} className='custom-btn custom-btn-search p-2' >Cancelar animación</button>
								</div>
								{/* BUTTONS TO REDUCE OR ENLARGE THE MAZE */}
								<div className='d-flex flex-column'>
									<h1 className='h4 mb-4'>Cambiar tamaño del maze</h1>
									<div>
										<button onClick={makeZoomIn} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomIn /></button>
										<button onClick={makeZoomOut} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomOut /></button>
										<button onClick={restoreSize} className="custom-btn custom-btn-search p-2">Restablecer</button>
									</div>
								</div>
							</div>
							<hr />
						</Container>
					</div>
					<div className='row p-4 w-100'>
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
												{
													console.log('No grid')
												}
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
									<Intructions instructions={instructions} setInstructions={setInstructions} />
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
