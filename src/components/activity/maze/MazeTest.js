import React, { useContext, useEffect, useRef, useState } from 'react'

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// SCSS
import './MazeTest.scss';

// Images
import maze_block from '../../../assets/maze-block.jpg'
import maze_start from '../../../assets/maze-start.jpg'
import maze_end from '../../../assets/maze-end.jpg'

// COMPONENTS

// Material UI core
import { IconButton } from '@material-ui/core';

// Icons
import { ViewAgenda } from '@material-ui/icons';

export default function MazeTest() {

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

	const cols = 5; // Num of columns of the maze
	const rows = 5; // Num of columns of the maze

	var wX = mazeSize / cols; // Width of each cell
	var wY = mazeSize / rows; // Height of each cell

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
									backgroundSize: 'cover',
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

		handleClick(cell) {
			let index = mazeGrid.indexOf(this);

			if (!this.draw_img && this.selectedAction !== actions.EMPTY) { // If select a cell with the option not empty to render the image occording the option
				this.current_type = this.selectedAction;
				this.draw_img = true;
			} else if (this.draw_img && this.selectedAction !== actions.EMPTY && this.current_type === this.selectedAction) { // If selelect  a cell with an option not empty that is rendered to derender
				this.current_type = this.selectedAction;
				this.draw_img = false;
			} else if (this.draw_img && this.selectedAction !== actions.EMPTY && this.current_type !== this.selectedAction) { // If selelect a cell with an option not empty that is rendered with a diferent option to render the image according with the new option
				this.current_type = this.selectedAction;
			} else if (this.selectedAction === actions.EMPTY) { // To render the empty option
				this.current_type = this.selectedAction;
				this.draw_img = false;
			}

			this.setImage();

			setMazeGrid(mazeGrid.map((cell, i) => {
				return i === index ? this : cell;
			}))

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
	}, [mazeSize])

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

		wX = mazeSize / cols;
		wY = mazeSize / rows;

		setMazeStyle({
			width: `${mazeSize}px`,
			height: `${mazeSize}px`
		})

		var auxGrid = mazeGrid;
		if (mazeGrid.length <= 0) {
			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					var cell = new Cell(i, j, wX, wY);
					auxGrid.push(cell);
				}
			}
		} else {
			for (let i = 0; i < auxGrid.length; i++) {
				auxGrid[i].updateXY(wX, wY);
			}
		}
		setMazeGrid(auxGrid);
	}

	const handleChangeAction = (action) => {
		setSelectedAction(action);

		var auxGrid = mazeGrid;
		for (let i = 0; i < auxGrid.length; i++) {
			auxGrid[i].updateSelectedAction(action);
		}
		setMazeGrid(auxGrid);
	}

	return (
		<div className='pb-5'>
			<div className='row p-4 w-100'>
				<div className='maze-container col-md-8' ref={myRef}>
					<div className='maze' style={mazeStyle} >
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
				<div className='col-md-4 d-flex justify-content-center align-items-center'>
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
