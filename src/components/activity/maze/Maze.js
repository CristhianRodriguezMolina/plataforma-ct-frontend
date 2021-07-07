import React, { useContext, useEffect, useRef, useState } from 'react'

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// SCSS
import './Maze.scss';

// Images
import robot from '../../../assets/robot.svg'

// COMPONENTS

// Cell of the maze
import Cell from './Cell';

// Material UI core
import { IconButton, Container } from '@material-ui/core';

// Icons
import { ViewAgenda, ZoomIn, ZoomOut } from '@material-ui/icons';

// DynamicInput
import DynamicInput from '../../common/DynamicInput';

import { motion } from 'framer-motion'

import { keyframes } from 'styled-components'

export default function Maze() {

	// Variables del contexto
	const { changeColor } = useContext(UserContext);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#f8bbd0');
	});

	// VARIABLES DEL MAZE -------------------------------------------------------------------------------------------------

	// Maze container reference
	const myRef = useRef(null);

	// The maze
	const [maze, setMaze] = useState([]);

	// Size of the maze
	const [mazeSize, setMazeSize] = useState(0)
	// const [mazeOffset, setMazeOffset] = useState(0);

	const [cols, setCols] = useState(5); // Num of columns of the maze
	const [rows, setRows] = useState(5); // Num of columns of the maze

	const [reformingMaze, setReformingMaze] = useState(true); // Variable for reform the maze

	const [wX, setWX] = useState(mazeSize / cols)
	const [wY, setWY] = useState(mazeSize / rows)

	const [isStart, setIsStart] = useState(false);
	const [isEnd, setIsEnd] = useState(false);

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

	// Cambia en cada actualizacion el tamaño del maze
	useEffect(() => {
		if (myRef) {
			setMazeSize(myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth);
		}
	}, [])

	// Cada que el tamaño del maze cambia entonces actualiza los valores con base en el tamaño del maze
	useEffect(() => {
		setUp();
	}, [mazeSize, reformingMaze]) // Execute setUp if the mazeSize changes or if is reformingMaze

	// Cambia el tamaño del maze cada que cambia el tamaño de la pagina
	useEffect(() => {
		const setSize = () => {
			console.log(myRef)
			setMazeSize(myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth);
		}

		window.addEventListener("beforeunload", setSize)
		window.addEventListener('resize', setSize)
		return () => {
			window.removeEventListener('beforeunload', setSize)
			window.removeEventListener('resize', setSize)
		}
	}, [])

	// Metodo para inicializar o actualizar los valores de tamaño del maze ---------------------------------------------------------------------------
	const setUp = () => {
		console.log(mazeSize)

		setWX(mazeSize / cols); // Width of each cell
		setWY(mazeSize / rows); // Height of each cell

		setMazeStyle({
			width: `${mazeSize}px`,
			height: `${mazeSize}px`
		})

		setRobotStyle(prevStyle => {
			return { ...prevStyle, width: mazeSize / cols, height: mazeSize / rows }
		})

		if (maze.length <= 0 || reformingMaze) {
			var auxGrid = maze;

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
			console.log(auxGrid)
			setReformingMaze(false); // Set the reforming flag to false
			setMaze(auxGrid);
		}
	}

	// Method to change the type of image to show in the cells
	const handleChangeAction = (action) => {
		setSelectedAction(action);
	}

	const updateName = (value) => {
		setActivityName(value);
	};

	const updateDes = (value) => {
		setActivityDescription(value);
	};

	// Method to zoomin the maze
	const makeZoomIn = () => {
		// setMazeOffset(mazeOffset + 20);
		setMazeSize(mazeSize + 20);
	}

	// Method to zoomout the maze
	const makeZoomOut = () => {
		// setMazeOffset(mazeOffset - 20);
		setMazeSize(mazeSize - 20);
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
	const [keyFrames, setKeyFrames] = useState([]);
	const [currentFrame, setCurrentFrame] = useState(0);
	const [animate, setAnimate] = useState(false);
	const [currentDirection, setCurrentDirection] = useState('UP');
	const [currentGrades, setCurrentGrades] = useState(0);

	const [robotStyle, setRobotStyle] = useState({
		backgroundImage: `url(${robot})`,
		backgroundSize: '100% 100%',
		position: 'absolute',
		left: 0,
		top: 0,
		width: 0,
		height: 0,
		alignSelf: 'center',
		zIndex: 1000000,
		transitionDuration: '1s'
	});

	const createAnimation = () => {
		console.log('Changing the animation')

		if (!animate) {
			setKeyFrames(['RIGHT', 'FORWARD', 'RIGHT']);
			setAnimate(true);
		} else {
			if (currentFrame + 1 > keyFrames.length) {
				setAnimate(false);
				setCurrentFrame(0);
				setKeyFrames([]);
				setRobotStyle({
					backgroundImage: `url(${robot})`,
					backgroundSize: '100% 100%',
					position: 'absolute',
					left: 0,
					top: 0,
					width: wX,
					height: wY,
					alignSelf: 'center',
					zIndex: 1000000,
					transitionDuration: '1s'
				});
				setCurrentGrades(0);
				return;
			}

			const frame = keyFrames[currentFrame];

			if (frame === 'FORWARD') {
				if (currentDirection === 'UP') {
					setRobotStyle(prevStyle => {
						return { ...prevStyle, top: prevStyle.top - wY }
					})
				} else if (currentDirection === 'DOWN') {
					setRobotStyle(prevStyle => {
						return { ...prevStyle, top: prevStyle.top + wY }
					})
				} else if (currentDirection === 'RIGHT') {
					setRobotStyle(prevStyle => {
						return { ...prevStyle, left: prevStyle.left + wX }
					})
				} else if (currentDirection === 'LEFT') {
					setRobotStyle(prevStyle => {
						return { ...prevStyle, left: prevStyle.left - wX }
					})
				}
			} else if (frame === 'RIGHT') {
				setCurrentDirection('RIGHT');
				setRobotStyle(prevStyle => {
					return { ...prevStyle, transform: `rotate(${currentGrades + 90}deg)` }
				})
				setCurrentGrades(currentGrades + 90);
			} else if (frame === 'LEFT') {
				setCurrentDirection('DOWN');
				setRobotStyle(prevStyle => {
					return { ...prevStyle, transform: `rotate(${currentGrades - 90}deg)` }
				})
				setCurrentGrades(currentGrades - 90);
			}

			setCurrentFrame(currentFrame + 1);
		}
	}

	return (
		<div className='pb-5'>
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
								<button className="custom-btn custom-btn-primary p-2">Restablecer</button>
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
					<div className='mt-5'>
						<button onClick={() => createAnimation()} className='custom-btn custom-btn-success p-2'>Probar maze</button>
					</div>
				</Container>
			</div>
			<div className='row p-4 w-100'>
				<div className='col-md-6' >
					{/* MAZE */}
					<div className='maze-container' ref={myRef}>
						<div className='maze' style={mazeStyle}>
							{
								maze.length > 0 ?
									<>
										{
											maze.map(cell => (
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
												/>
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
							<div
								style={robotStyle}
							/>
						</div>
					</div>
				</div>
				<div className='col-md-6 d-flex justify-content-center align-items-center'>
					<h1>Your current selection<br />{selectedAction}</h1>
				</div>
			</div>
			<div className='options-palette-container'>
				<div className='options-palette'>
					<IconButton onClick={() => { handleChangeAction(actions.BLOCK); }} color='inherit'>
						<div className='d-flex flex-column align-items-center m-2'>
							<ViewAgenda />
							<h1 className='h4'>Block</h1>
						</div>
					</IconButton>
					<IconButton onClick={() => { handleChangeAction(actions.EMPTY); }} color='inherit'>
						<div className='d-flex flex-column align-items-center m-2'>
							<ViewAgenda />
							<h1 className='h4'>Empty</h1>
						</div>
					</IconButton>
					<IconButton onClick={() => { handleChangeAction(actions.START); }} color='inherit'>
						<div className='d-flex flex-column align-items-center m-2'>
							<ViewAgenda />
							<h1 className='h4'>Start</h1>
						</div>
					</IconButton>
					<IconButton onClick={() => handleChangeAction(actions.END)} color='inherit'>
						<div className='d-flex flex-column align-items-center m-2'>
							<ViewAgenda />
							<h1 className='h4'>End</h1>
						</div>
					</IconButton>
				</div>
			</div>
		</div>
	)
}
