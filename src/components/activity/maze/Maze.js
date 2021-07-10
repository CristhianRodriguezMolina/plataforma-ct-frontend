import React, { useContext, useEffect, useRef, useState } from 'react'
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
import CreateMaze from './CreateMaze';

// Cell of the maze
import Cell from './Cell';

// Material UI core
import { IconButton, Container } from '@material-ui/core';

// Icons
import { ZoomIn, ZoomOut } from '@material-ui/icons';

// DynamicInput
import DynamicInput from '../../common/DynamicInput';

// Styled-components
import styled, { css, keyframes } from 'styled-components'

// Alert
import Alert from '@material-ui/lab/Alert';

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

	// Maze container reference
	const myRef = useRef(null);

	// The maze
	const [maze, setMaze] = useState(null);

	// Size of the maze
	const [mazeSize, setMazeSize] = useState(0)
	const [mazeSizeOffset, setMazeSizeOffset] = useState(0);

	const [cols, setCols] = useState(5); // Num of columns of the maze
	const [rows, setRows] = useState(5); // Num of columns of the maze

	const [reformingMaze, setReformingMaze] = useState(true); // Variable for reform the maze

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

	// Use effects ----------------------------------------------------------------------------------------------------------------------------------

	useEffect(() => {
		if (!maze) {
			fetchMaze();
		}
	}, [maze])

	// Si cambia la posicion del inicio se cambia la del robot y se reicinia la variable flag que muestra el robot
	useEffect(() => {
		setAnimate(false);
		setRobotX(startX);
		setRobotY(startY);
	}, [startX, startY])

	// Cambia en cada actualizacion el tamaño del maze
	useEffect(() => {
		if (myRef) {
			console.log(myRef);
			setMazeSize(myRef.current.clientWidth);
			// setMazeSize(myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth);
		}
	}, [])

	// Cada que el tamaño del maze cambia entonces actualiza los valores con base en el tamaño del maze
	useEffect(() => {
		if (maze) {
			console.log(maze)
			setUp();
		}
	}, [maze, mazeSize, mazeSizeOffset, reformingMaze]) // Execute setUp if the mazeSize changes or if is reformingMaze

	// Cambia el tamaño del maze cada que cambia el tamaño de la pagina
	useEffect(() => {
		const setSize = () => {
			console.log(myRef)
			setMazeSize(myRef.current.clientWidth);
			// setMazeSize(myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth);
		}

		window.addEventListener("beforeunload", setSize)
		window.addEventListener('resize', setSize)
		return () => {
			window.removeEventListener('beforeunload', setSize)
			window.removeEventListener('resize', setSize)
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

		if (maze.cells.length <= 0 || reformingMaze) {
			var auxGrid = maze.cells;

			if (reformingMaze) auxGrid = []; // If the maze is reforming then the grid base turn empty

			setIsStart(false);
			setIsEnd(false);

			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					const cell = {
						i,
						j,
						type: actions.EMPTY
					}
					auxGrid.push(cell);
				}
			}
			setReformingMaze(false); // Set the reforming flag to false
			setMaze(prevMaze => {
				return { ...prevMaze, cells: auxGrid }
			});
		}
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
			setMazeSizeOffset(mazeSizeOffset + 20);
		}
	}

	// Method to zoomout the maze
	const makeZoomOut = () => {
		setMazeSizeOffset(mazeSizeOffset - 20);
	}

	// Restore the initial size of the maze
	const restoreSize = () => {
		setMazeSizeOffset(0);
	}

	// Method to change the cols and rows of the maze
	const setNewSize = (e) => {
		e.preventDefault();

		setRows(e.target[0].value)
		setCols(e.target[1].value)

		setReformingMaze(true); // Turn the reforming flag to true
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

	// const [frameActions, setFrameActions] = useState(['RIGHT', 'FORWARD', 'RIGHT', 'FORWARD']);	// const [currentFrame, setCurrentFrame] = useState(0);

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

	const createAnimation = () => {

		if (!isStart || !isEnd) {
			showError('No ha definido el inicio y el fin del laberinto!!')
			return;
		}

		if (!animate) {
			showInfo('Primero active el Robot!!')
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
		const frameActions = ['LEFT', 'FORWARD', 'FORWARD', 'FORWARD', 'FORWARD'];

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

		// Number of cells that can be traveled
		var usableCells = frameActions.length;

		// Flag to see if there is an error in the path of the maze
		var isError = false;

		// Message that gonna be show to the user if there is an error
		var errorMessage = '';

		// Flag to see if there is a win in the path of the maze
		var isWin = false;

		// for (let i = 0; i < frameActions.length; i++) {
		// 	// Current cell of the animation to be analized
		// 	const currentCell = getCell(Math.round(currentLeft / wX), Math.round(currentTop / wY));

		// 	// If the path is the END of the maze then set a win and comes out of the for
		// 	if (currentCell.type === actions.END) {
		// 		usableCells = i + 1;
		// 		isWin = true;
		// 		break;
		// 	}

		// 	// If the path is blocked then set a error and comes out of the for
		// 	if (currentCell.type === actions.BLOCK || currentCell.type === 'NOT_EXIST' || i === frameActions.length - 1) {
		// 		usableCells = i + 1;

		// 		if (currentCell.type === actions.BLOCK) {
		// 			errorMessage = 'El robot choco con una pared';
		// 		} else if (currentCell.type === 'NOT_EXIST') {
		// 			errorMessage = 'El robot se cayo del laberinto';
		// 		} else if (i === frameActions.length - 1) {
		// 			errorMessage = 'No se encontró el final del laberinto';
		// 		}

		// 		isError = true;
		// 		break;
		// 	}
		// }

		// Current percent of the animation and the offset 
		const percentOffset = Math.floor(100 / usableCells);
		var currentPercent = percentOffset;

		for (let i = 0; i < usableCells; i++) {

			// Current action to be analized and processed
			const action = frameActions[i];

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

			// Current cell of the animation to be analized
			const currentCell = getCell(Math.round(currentLeft / wX), Math.round(currentTop / wY));

			// If the path is the END of the maze then set a win and comes out of the for
			if (currentCell.type === actions.END) {
				isWin = true;
				animateDuration = Math.floor(((i + 1) / frameActions.length) * 5);
				setAnimationDuration(`${animateDuration}s`);
				break;
			}

			// If the path is blocked then set a error and comes out of the for
			if (currentCell.type === actions.BLOCK || currentCell.type === 'NOT_EXIST' || i === frameActions.length - 1) {

				if (currentCell.type === actions.BLOCK) {
					errorMessage = 'El robot choco con una pared';
				} else if (currentCell.type === 'NOT_EXIST') {
					errorMessage = 'El robot se cayo del laberinto';
				} else if (i === frameActions.length - 1) {
					errorMessage = 'No se encontró el final del laberinto';
				}

				isError = true;
				animateDuration = Math.floor(((i + 1) / frameActions.length) * 5);
				setAnimationDuration(`${animateDuration}s`);
				break;
			}
		}

		// Final step of the animation
		stringKeyFrame += `
			to{
				top: ${currentTop}px;
				left: ${currentLeft}px;
				transform: rotate(${currentGrades}deg);
			}
		`

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

		// Set the created animation
		setAnimation(keyframes`
		  	${stringKeyFrame}
		`);

		setRobotX(currentLeft);
		setRobotY(currentTop);
		setRobotGrades(currentGrades);

		if (isError || isWin) {
			console.log('Hubo un error en el camino del maze')
			setTimeout(() => {
				if (isError) {
					showError(errorMessage);
				}

				if (isWin) {
					showSuccess('Felicidades completaste el laberinto')
				}

				setAnimationDuration('1s');
				setAnimationRepeat(5);

				setAnimation(keyframes`
				  ${isWin ? winAnimation : errorAnimation}
				`);

				setTimeout(() => {
					setRobotX(startX);
					setRobotY(startY);
					setRobotGrades(0);

					setAnimation(``);
					setAnimate(false);

					// When the animation ends then the button to prove the maze and the button to show the robot are activated
					btnProveMaze.current.disabled = false;
					btnShowRobot.current.disabled = false;
				}, 6000)
			}, animateDuration * 1000)
		} else {
			setTimeout(() => {
				setRobotX(startX);
				setRobotY(startY);
				setRobotGrades(0);

				setAnimation(``);
				setAnimate(false);

				// When the animation ends then the button to prove the maze and the button to show the robot are activated
				btnProveMaze.current.disabled = false;
				btnShowRobot.current.disabled = false;
			}, animateDuration * 1000)
		}

	}

	const handleShowRobot = () => {
		if (isStart && isEnd) {
			console.log(animate)
			setAnimate(!animate)
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
					<div className="maze-header">
						<Container maxWidth='md'>
							{/* GENERAL DATA OF THE MAZE */}
							<div>
								<DynamicInput dynamicInputValue={activityName} dynamicInputStyle={nameInputStyle} sendValue={updateName}></DynamicInput>
								<DynamicInput dynamicInputValue={activityDescription} dynamicInputStyle={desInputStyle} sendValue={updateDes}></DynamicInput>
							</div>
							<hr />
							<div className='d-flex justify-content-around align-items-center'>
								{/* BUTTONS TO REDUCE OR ENLARGE THE MAZE */}
								<div className='d-flex flex-column'>
									<h1 className='h4 mb-4'>Cambiar tamaño del maze</h1>
									<div>
										<button onClick={makeZoomIn} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomIn /></button>
										<button onClick={makeZoomOut} className="btn-zoom custom-btn custom-btn-primary mr-2"><ZoomOut /></button>
										<button onClick={restoreSize} className="custom-btn custom-btn-primary p-2">Restablecer</button>
									</div>
								</div>
								{/* FORM TO CHANGE THE ROWS AND COLS */}
								<div className="d-flex flex-column justify-content-between">
									<h1 className='h4'>Cambiar filas y cols</h1>
									<form onSubmit={setNewSize} className="form-size d-flex justify-content-between align-items-center">
										<div>
											<label className='m-0'>Filas</label>
											<input type="number" value={rows} onChange={(evt) => setRows(evt.target.value)} className='form-control' label='Columnas Del Maze' name='cols' />
										</div>
										<label className='mx-3 mb-2 align-self-end'>X</label>
										<div className='mr-3'>
											<label className='m-0'>Cols</label>
											<input type="number" value={cols} onChange={(evt) => setCols(evt.target.value)} className='form-control' label='Filas Del Maze' name='rows' />
										</div>
										<button type="submit" className="custom-btn custom-btn-primary p-2">Establecer tamaño</button>
									</form>
								</div>
							</div>
						</Container>
					</div>
					<div className='row p-4 w-100'>
						<div className='col-md-6' >
							{/* MAZE */}
							<div className='maze-container' ref={myRef}>
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
												{
													console.log('No grid')
												}
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
						<div className='col-md-6 d-flex justify-content-center align-items-center'>
							<CreateMaze />
						</div>
					</div>
					<div className='mt-5'>
						<h1>Your current selection<br />{selectedAction}</h1>
						<button onClick={() => createAnimation()} className='custom-btn custom-btn-success p-2 mr-2' ref={btnProveMaze} >Probar maze</button>
						<button onClick={handleShowRobot} className='custom-btn custom-btn-primary p-2' ref={btnShowRobot} >Mostrar/Ocultar robot</button>
					</div>
					<div className='options-palette-container'>
						<div className='options-palette'>
							<IconButton onClick={() => { handleChangeAction(actions.BLOCK); }} color='inherit'>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundImage: `url(${maze_block})`,
											backgroundSize: '100% 100%',
										}}
									/>
									<h1 className='h4'>Block</h1>
								</div>
							</IconButton>
							<IconButton onClick={() => { handleChangeAction(actions.EMPTY); }} color='inherit'>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundColor: '#6cbae3',
										}}
									/>
									<h1 className='h4'>Empty</h1>
								</div>
							</IconButton>
							<IconButton onClick={() => { handleChangeAction(actions.START); }} color='inherit'>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundImage: `url(${maze_start})`,
											backgroundSize: '100% 100%',
										}}
									/>
									<h1 className='h4'>Start</h1>
								</div>
							</IconButton>
							<IconButton onClick={() => handleChangeAction(actions.END)} color='inherit'>
								<div className='d-flex flex-column align-items-center m-1'>
									<div
										className='icon'
										style={{
											backgroundImage: `url(${maze_end})`,
											backgroundSize: '100% 100%',
										}}
									/>
									<h1 className='h4'>End</h1>
								</div>
							</IconButton>
						</div>
					</div>
				</>
				: ''}
		</div >
	)
}
