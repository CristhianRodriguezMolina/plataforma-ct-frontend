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
import maze_block from '../../../assets/maze-block.jpg'
import maze_start from '../../../assets/maze-start.jpg'
import maze_end from '../../../assets/maze-end.jpg'

// COMPONENTS

// Instructions
import Intructions from './Intructions';

// Cell of the maze
import Cell from './Cell';

// Material UI core
import { Container, ButtonBase, FormControlLabel, Switch } from '@material-ui/core';

// Icons
import { ZoomIn, ZoomOut } from '@material-ui/icons';

// DynamicInput
import DynamicInput from '../../common/DynamicInput';

// Styled-components
import styled, { css, keyframes } from 'styled-components'

// Alert
import Alert from '@material-ui/lab/Alert';

// Titulo
import TitleCard from '../../common/TitleCard';

// Alert modal
import AlertModal from '../../common/AlertModal';

export default function Maze() {

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

	// Funcion para mostrar una alerta información dado un mensaje
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

	// Verified activity 
	const [verified, setVerified] = useState(false);

	// activity difficulty
	const [difficulty, setDifficulty] = useState('beginner');

	// variable to confirmation modal to clean the maze
	const [open, setOpen] = useState(false);

	// MAZE VARIABLES

	// The maze
	const [maze, setMaze] = useState(null);

	// Size of the maze
	const [mazeSize, setMazeSize] = useState(0)
	const [mazeSizeOffset, setMazeSizeOffset] = useState(0);

	const [cols, setCols] = useState(5); // Num of columns of the maze
	const [rows, setRows] = useState(5); // Num of columns of the maze

	const [reformingMaze, setReformingMaze] = useState(false); // Variable for reform the maze

	const [wX, setWX] = useState((mazeSize + mazeSizeOffset) / cols)
	const [wY, setWY] = useState((mazeSize + mazeSizeOffset) / rows)

	const [isStart, setIsStart] = useState(false);
	const [isEnd, setIsEnd] = useState(false);

	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);

	// Actions for render different things in the maze
	const actions = {
		BLOCK: 'BLOCK',
		EMPTY: 'EMPTY',
		START: 'START',
		END: 'END'
	}

	// Seleceted image to paint
	const [selectedAction, setSelectedAction] = useState(actions.BLOCK);

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

	useEffect(() => {
		if (!maze) {
			fetchMaze();
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
	}, [maze, mazeSize, mazeSizeOffset, reformingMaze]) // Execute setUp if the mazeSize changes or if is reformingMaze

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
				verifyStartEnd(res.data); // It verifies if the comming maze have start and/or end
				setActivityName(res.data.activity_id.name); // Activity_id is the activity schema of the maze
				setActivityDescription(res.data.activity_id.description);
				setVerified(res.data.activity_id.verified);
				setDifficulty(res.data.activity_id.difficulty);
				setLoading(false);
			})
			.catch(err => {
				setLoading(false);
				if (err.response) {
					showError(err.response.data.message);
				}
				else {
					showError("¡No se han podido obtener el laberinto, por favor inténtelo mas tarde!");
				}
			})
	}

	// Metodo para inicializar o actualizar los valores de tamaño del maze 
	const setUp = () => {
		if (rows > 8 || cols > 8 || rows < 4 || cols < 4 || !Number.isInteger(parseFloat(rows)) || !Number.isInteger(parseFloat(cols))) {
			setRows(maze.rows);
			setCols(maze.cols);
			return;
		}

		setWX((mazeSize + mazeSizeOffset) / cols); // Width of each cell
		setWY((mazeSize + mazeSizeOffset) / rows); // Height of each cell

		setMazeStyle({
			width: `${(mazeSize + mazeSizeOffset)}px`,
			height: `${(mazeSize + mazeSizeOffset)}px`
		})

		if (reformingMaze) {
			verifyStartEnd(maze);
		}
	}

	// Verify if there is or not a start and/or an end
	const verifyStartEnd = (maze) => {
		// This flags are to verify if the new maze doesnt have start or end			
		var isStart = false;
		var isEnd = false;

		for (let i = 0; i < maze.cells.length; i++) {
			var auxCell = maze.cells[i];

			if (auxCell.type === actions.START) {
				isStart = true;
			}

			if (auxCell.type === actions.END) {
				isEnd = true;
			}
		}
		// If the new maze doesnt have start then set IsStart to false
		if (!isStart) {
			setIsStart(false);
		} else {
			setIsStart(true);
		}

		// If the new maze doesnt have end then set IsEnd to false
		if (!isEnd) {
			setIsEnd(false);
		} else {
			setIsEnd(true);
		}

		setReformingMaze(false); // Set the reforming flag to false
	}

	// Method to clean the maze and set all cells to empty
	const cleanMaze = () => {
		setIsStart(false);
		setIsEnd(false);

		var auxGrid = maze.cells;

		auxGrid = auxGrid.map(cell => {
			return { ...cell, type: actions.EMPTY }
		})

		setMaze(prevMaze => {
			return { ...prevMaze, cells: auxGrid }
		});
	}

	// Method to change the type of image to show in the cells
	const handleChangeAction = (action) => {
		setSelectedAction(action);
	}

	// Update the maze name
	const updateName = (value) => {
		setActivityName(value);
	};

	// Update the maze description
	const updateDes = (value) => {
		setActivityDescription(value);
	};

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

	// Method to change the cols and rows of the maze
	const setNewSize = async (e) => {
		e.preventDefault();

		// If the size still equals just doesnt change anything
		if (e.target[0].value === maze.rows && e.target[1].value === maze.cols) {
			return;
		}

		try {
			const res = await api.put(`/api/maze/resize/${activityId}`, {
				cells: maze.cells,
				columns: e.target[1].value,
				rows: e.target[0].value,
				verified: maze.verified
			}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			});
			if (res) {
				setMaze(res.data.maze);

				setRows(e.target[0].value);
				setCols(e.target[1].value);

				setReformingMaze(true); // Turn the reforming flag to true
			}
		} catch (e) {
			if (e.response.data) {
				showError(e.response.data.message);
			} else {
				showError('Error inesperado en el servidor');
			}
		}

	}

	// Update the data of the maze in the DB
	const handleUpdateMaze = async () => {
		try {
			setProcess(true);
			setProcessMessage('Guardando cambios...');

			const response = await api.put(`/api/activity/${activityId}`, {
				activity: {
					name: activityName,
					description: activityDescription,
					verified,
					difficulty
				},
				child: {
					cells: maze.cells,
					instructions: maze.instructions,
					columns: maze.cols,
					rows: maze.rows
				}
			}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			});

			const { updatedActivity, message } = response.data;

			if (updatedActivity) {
				verifyStartEnd(maze);

				showSuccess(message);
			}
		} catch (error) {
			if (error.response) {
				showError(error.response.data.message);
			} else {
				showError("Un error ha ocurrido actualizando el laberinto");
			}
		}
		setProcess(false);
		setProcessMessage('');
	}

	const handleSetVerified = () => {
		setVerified(!verified)
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
		z-index: 501;
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

		if (!isStart || !isEnd) {
			showError('No ha definido el inicio y el fin del laberinto!!')
			return;
		}

		if (!animate) {
			showInfo('Primero active el Robot!!')
			return;
		}

		if (maze.instructions.length <= 0) {
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
		const frameActions = maze.instructions;

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
				} else if (currentCell.type === 'NOT_EXIST') {
					errorMazeMessage = 'El robot se cayo del laberinto';
				} else if (i === frameActions.length - 1) {
					errorMazeMessage = 'No se encontró el final del laberinto';
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

			// Update the maze when executes any instructions
			handleUpdateMaze();

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
		if (isStart && isEnd) {
			setAnimate(!animate)
			setAnimation(``);
			setAnimationExecutionType('NO_ANIMATION');
			setAnimationType('NO_ANIMATION');
		} else {
			showError('No ha definido el inicio y el fin del laberinto!!');
			setAnimate(false);
		}
	}

	return (
		<div className=''>
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

					{/* ALERT MODAL TO CLEAN ALL THE CELLS IN THE MAZE */}
					<AlertModal
						type="delete"
						open={open}
						handleClose={() => setOpen(!open)}
						message='¿Está seguro que quiere limpiar las celdas del laberinto?'
						actionText='Limpiar'
						action={cleanMaze}
					/>

					<div className="maze-header">
						<Container maxWidth='md'>
							{/* GENERAL DATA OF THE MAZE */}
							<div>
								<DynamicInput dynamicInputValue={activityName} dynamicInputStyle={nameInputStyle} sendValue={updateName}></DynamicInput>
								<DynamicInput dynamicInputValue={activityDescription} dynamicInputStyle={desInputStyle} sendValue={updateDes}></DynamicInput>
								<div className='activity-attributes'>

									<div className="difficulty-grid-item">
										<label>Dificultad:</label>
										<select className="form-control" style={{ width: '10em' }} onChange={evt => { setDifficulty(evt.target.value); }} value={difficulty} aria-label="Activity difficulty" required>
											<option value="beginner" selected>Principiante</option>
											<option value="intermediate">Intermedio</option>
											<option value="advanced">Avanzado</option>
										</select>
									</div>

									<div className="verified-grid-item">
										<FormControlLabel className="switcher" label="Verificado" control={
											<Switch
												checked={verified}
												onChange={handleSetVerified}
												name="visibilty"
												color="primary"
											/>
										} />
									</div>
								</div>
							</div>

							<hr />

							<div className='d-flex flex-wrap justify-content-around align-items-center'>
								{/* BUTTONS TO REDUCE OR ENLARGE THE MAZE */}
								<div className='d-flex flex-column align-items-center zoom-panel'>
									<h1 className='h4 mb-4'>Cambiar tamaño del laberinto</h1>
									<div>
										<button onClick={makeZoomIn} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomIn /></button>
										<button onClick={makeZoomOut} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomOut /></button>
										<button onClick={restoreSize} className="custom-btn custom-btn-search p-2">Restablecer</button>
									</div>
								</div>

								{/* FORM TO CHANGE THE ROWS AND COLS */}
								<div className="d-flex flex-column align-items-center justify-content-between">
									<h1 className='h4'>Cambiar filas y cols</h1>
									<form onSubmit={setNewSize} className="form-size d-flex justify-content-between align-items-center">
										<div>
											<label className='m-0'>Filas</label>
											<input type="number" min={4} max={8} value={rows} onChange={(evt) => setRows(evt.target.value)} className='form-control' label='Columnas Del Maze' name='cols' />
										</div>
										<label className='mx-3 mb-2 align-self-end'>X</label>
										<div className='mr-3'>
											<label className='m-0'>Cols</label>
											<input type="number" min={4} max={8} value={cols} onChange={(evt) => setCols(evt.target.value)} className='form-control' label='Filas Del Maze' name='rows' />
										</div>
										<button type="submit" className="custom-btn custom-btn-primary p-2 align-self-end mb-1">Establecer tamaño</button>
									</form>
								</div>
							</div>
							<hr />
						</Container>
					</div>

					<div className='mt-2 d-flex flex-wrap justify-content-center px-2 '>
						<div className='d-flex justify-content-center mt-2'>
							<button onClick={() => { setAnimationExecutionType('RUNNING'); setAnimationType('NO_ANIMATION') }} className='custom-btn custom-btn-success p-2 mr-2' ref={btnProveMaze} >Ejecutar</button>
							<button onClick={() => setOpen(!open)} className="custom-btn custom-btn-delete p-2 mr-2">Limpiar</button>
						</div>
						<div className='d-flex justify-content-center mt-2'>
							<button onClick={handleShowRobot} className='custom-btn custom-btn-primary p-2 mr-2' ref={btnShowRobot} >Activar/desactivar robot</button>
							<button onClick={cancelAnimation} className='custom-btn custom-btn-search p-2' >Cancelar ejecución</button>
						</div>
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
															maze={maze}
															setMaze={setMaze}
															selectedAction={selectedAction}
															actions={actions}
															isStart={isStart}
															isEnd={isEnd}
															setIsStart={setIsStart}
															setIsEnd={setIsEnd}
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
										isStart && isEnd && animate &&
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
									<>
										<h5 className='text-muted font-italic' style={{ fontSize: '1.1em' }}>Aquí pon las intrucciones de la solución mas óptima para este laberinto cuando lo hayas terminado</h5>
										<Intructions maze={maze} setMaze={setMaze} cols={cols} rows={rows} />
									</>
									: ''
							}
						</div>
					</div>

					<div className='options-palette-container'>
						<div className='options-palette'>
							<ButtonBase
								focusRipple
								className='option'
								onClick={() => { handleChangeAction(actions.BLOCK); }}
								style={selectedAction === actions.BLOCK ? { backgroundColor: 'white', color: 'rgb(48, 48, 48)' } : {}}
							>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundImage: `url(${maze_block})`,
											backgroundSize: '100% 100%',
										}}
									/>
									<h1 className='h4'>Pared</h1>
								</div>
							</ButtonBase>

							<ButtonBase
								focusRipple
								className='option'
								onClick={() => { handleChangeAction(actions.EMPTY); }}
								style={selectedAction === actions.EMPTY ? { backgroundColor: 'white', color: 'rgb(48, 48, 48)' } : {}}
							>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundColor: '#6cbae3',
										}}
									/>
									<h1 className='h4'>Borrador</h1>
								</div>
							</ButtonBase>

							<ButtonBase
								focusRipple
								className='option'
								onClick={() => { handleChangeAction(actions.START); }}
								style={selectedAction === actions.START ? { backgroundColor: 'white', color: 'rgb(48, 48, 48)' } : {}}
							>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundImage: `url(${maze_start})`,
											backgroundSize: '100% 100%',
										}}
									/>
									<h1 className='h4'>Inicio</h1>
								</div>
							</ButtonBase>

							<ButtonBase
								focusRipple
								className='option'
								onClick={() => handleChangeAction(actions.END)}
								style={selectedAction === actions.END ? { backgroundColor: 'white', color: 'rgb(48, 48, 48)' } : {}}
							>
								<div
									className='d-flex flex-column align-items-center m-1'
								>
									<div
										className='icon'
										style={{
											backgroundImage: `url(${maze_end})`,
											backgroundSize: '100% 100%',
										}}
									/>
									<h1 className='h4'>Fin</h1>
								</div>
							</ButtonBase>
						</div>
					</div>

					{/* BUTTON TO UPDATE THE MAZE DIRECTLY */}
					<button onClick={handleUpdateMaze} className='btn-save-maze custom-btn custom-btn-primary' style={{ zIndex: 1000 }}>Guardar</button>
				</>
				:
				<div className="spinner-loading">
					<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			}
		</div >
	)
}
