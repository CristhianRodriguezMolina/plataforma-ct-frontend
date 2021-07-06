import React, { useContext, useEffect, useRef, useState } from 'react'

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// SCSS
import './Maze.scss';

// Images
import maze_block from '../../../assets/maze-block.jpg'
import maze_start from '../../../assets/maze-start.jpg'
import maze_end from '../../../assets/maze-end.jpg'

// COMPONENTS

// Material UI core
import { IconButton, Container } from '@material-ui/core';

// Icons
import { ViewAgenda, ZoomIn, ZoomOut } from '@material-ui/icons';

// DynamicInput
import DynamicInput from '../../common/DynamicInput';

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

	// Size of the maze
	const [mazeGrid, setMazeGrid] = useState([]);

	const [mazeSize, setMazeSize] = useState(0)
	const [mazeOffset, setMazeOffset] = useState(0);

	// var cols = 5; // Num of columns of the maze
	// var rows = 5; // Num of columns of the maze
	const [cols, setCols] = useState(5);
	const [rows, setRows] = useState(5);
	const [reformingMaze, setReformingMaze] = useState(true);

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

	// Class for manage a cell object in the maze --------------------------------------- CELL CLASS -----------------------------------------------------
	class Cell {
		constructor(i, j, wX, wY) {
			this.i = i;
			this.j = j;
			this.x = i * wX;
			this.y = j * wY;
			this.wX = wX;
			this.wY = wY;
			this.draw_img = false; // Falg to see if some image is rendering
			this.current_type = actions.EMPTY; // The current draw over the cell
			this.image = null;
			this.selectedAction = actions.BLOCK;
		}

		getCell() {
			return (
				<div
					key={`'${this.i}${this.j}'`}
					onClick={() => this.handleClick(this)}
					style={{
						border: '1px solid white',
						position: 'absolute',
						left: this.x,
						top: this.y,
						width: this.wX,
						height: this.wY,
						alignContent: 'center',
						justifyContent: 'center',
						display: 'flex'
					}}
				>
					{
						this.draw_img && this.current_type !== actions.EMPTY ?
							<div
								style={{
									backgroundImage: `url(${this.image})`,
									backgroundSize: '100% 100%',
									width: '90%',
									height: '90%',
									alignSelf: 'center'
								}}
							/>
							:
							''
					}
				</div>
			)
		}

		setImage() {
			if (this.current_type === actions.BLOCK) {
				this.image = maze_block;
			} else if (this.current_type === actions.START) {
				this.image = maze_start;
			} else if (this.current_type === actions.END) {
				this.image = maze_end;
			}
		}

		handleClick() {

			var flag = true;



			if (flag) {
				if (!this.draw_img && this.selectedAction !== actions.EMPTY) { // If select a cell with the option not empty to render the image occording the option
					this.current_type = this.selectedAction;
					this.draw_img = true;

					// If the selectedAction is start or end then change that variables to true respectively
					if (this.selectedAction === actions.START) {
						setIsStart(true);
					} else if (this.selectedAction === actions.END) {
						setIsEnd(true);
					}
				} else if (this.draw_img && this.selectedAction !== actions.EMPTY && this.current_type === this.selectedAction) { // If selelect  a cell with an option not empty that is rendered to derender
					// If the current type of the image is start or end then change that variables to false respectively
					if (this.current_type === actions.START) {
						setIsStart(false);
					} else if (this.current_type === actions.END) {
						setIsEnd(false);
					}

					this.current_type = this.selectedAction;
					this.draw_img = false;
				} else if (this.draw_img && this.selectedAction !== actions.EMPTY && this.current_type !== this.selectedAction) { // If selelect a cell with an option not empty that is rendered with a diferent option to render the image according with the new option
					// If the current type of the image is start or end then change that variables to false respectively
					if (this.current_type === actions.START) {
						setIsStart(false);
					} else if (this.current_type === actions.END) {
						setIsEnd(false);
					}

					this.current_type = this.selectedAction;

					// If the selectedAction is start or end then change that variables to true respectively
					if (this.selectedAction === actions.START) {
						setIsStart(true);
					} else if (this.selectedAction === actions.END) {
						setIsEnd(true);
					}
				} else if (this.selectedAction === actions.EMPTY) { // To render the empty option
					// If the current type of the image is start or end then change that variables to false respectively
					if (this.current_type === actions.START) {
						setIsStart(false);
					} else if (this.current_type === actions.END) {
						setIsEnd(false);
					}

					this.current_type = this.selectedAction;
					this.draw_img = false;
				}

				this.setImage();

				// With this the maze grid get updated
				setMazeGrid(prevValues => {
					return prevValues.map((cell, i) => {
						return cell;
					})
				});
			}
		}

		// Update x and y variables
		updateXY(wX, wY) {
			this.wX = wX;
			this.wY = wY;
			this.x = this.i * this.wX;
			this.y = this.j * this.wY;
		}

		updateSelectedAction(action) {
			this.selectedAction = action;
		}
	}

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

		var wX = mazeSize / cols; // Width of each cell
		var wY = mazeSize / rows; // Height of each cell

		setMazeStyle({
			width: `${mazeSize}px`,
			height: `${mazeSize}px`
		})

		var auxGrid = mazeGrid;
		if (mazeGrid.length <= 0 || reformingMaze) {
			if (reformingMaze) auxGrid = []; // If the maze is reforming then the grid base turn empty
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					var cell = new Cell(i, j, mazeSize / cols, mazeSize / rows);
					auxGrid.push(cell);
				}
			}
			setReformingMaze(false); // Set the reforming flag to false
		} else {
			for (let i = 0; i < auxGrid.length; i++) {
				auxGrid[i].updateXY(wX, wY);
			}
		}
		setMazeGrid(auxGrid);
	}

	// Method to change the type of image to show in the cells
	const handleChangeAction = (action) => {
		setSelectedAction(action);

		var auxGrid = mazeGrid;
		for (let i = 0; i < auxGrid.length; i++) {
			auxGrid[i].updateSelectedAction(action);
		}

		setMazeGrid(auxGrid);
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
				</Container>
			</div>
			<div className='row p-4 w-100'>
				<div className='col-md-6' >
					{/* MAZE */}
					<div className='maze-container' ref={myRef}>
						<div className='maze' style={mazeStyle}>
							{
								mazeGrid.length > 0 ?
									<>
										{
											mazeGrid.map(cell => {
												return cell.getCell();
											})
										}
									</>
									:
									<>
										{
											console.log('No grid')
										}
									</>
							}
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
