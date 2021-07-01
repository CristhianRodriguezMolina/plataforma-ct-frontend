import React, { useContext, useEffect, useState } from 'react'

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// SCSS
import './maze.scss';

// p5
import * as p5 from 'p5';

// Images
import maze_block from '../../../assets/maze-block.jpg'
import maze_start from '../../../assets/maze-start.jpg'
import maze_end from '../../../assets/maze-end.jpg'

// COMPONENTS

// Icons
import { ViewAgenda } from '@material-ui/icons';

// Material UI Core
import { IconButton } from '@material-ui/core';

export default function Maze() {

	// Variables del contexto
	const { changeColor } = useContext(UserContext);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#f8bbd0');
	});

	// Actions for render different things in the maze
	const actions = {
		BLOCK: 'BLOCK',
		EMPTY: 'EMPTY',
		START: 'START',
		END: 'END'
	}

	// Action to do something on the maze
	var selectedAction = actions.BLOCK;

	// Current button pressed
	const [currentButton, setCurrentButton] = useState(actions.BLOCK);

	// P5 -----------------------------------------------------------------------------------------------------------------------

	// Ref of the component where P5 is rendering
	var myRef = React.createRef()

	// The P5 object
	var myP5;

	// All the P5 logic
	const sketch = (p) => {

		// GLOBAL VARIABLES	
		var grid = []; // Array that have all the cell objects for the maze		

		// Size of the maze
		var mazeSize = myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth;

		var cols = 4; // Num of columns of the maze
		var rows = 5; // Num of rows of the maze

		var wX = mazeSize / cols; // Width of each cell
		var wY = mazeSize / rows; // Height of each cell

		// Size of the maze, num of cols and num of rows for the size of a cell 
		var mazeWidth = mazeSize;
		var mazeHeight = mazeSize;

		// Images
		var mazeBlockImg;
		var mazeStart;
		var mazeEnd;

		// Deactivate FES for performance
		p.disableFriendlyErrors = true; // disables Friendly Error System (FES)

		// Class for manage a cell object in the maze --------------------------------------- CELL CLASS -----------------------------------------------------
		class Cell {
			constructor(i, j) {
				this.i = i;
				this.j = j;
				this.x = i * wX;
				this.y = j * wY;
				this.draw_img = 0; // Falg to see if some image is rendering
				this.rendering = 1; // Flag to see if the cell is rendering
				this.current_type = actions.EMPTY; // The current draw over the cell
			}

			// Update x and y variables
			updateXY() {
				this.rendering = 1; // When update the X and Y then render again
				this.x = this.i * wX;
				this.y = this.j * wY;
			}

			// Method to show the cell
			show() {
				if (this.rendering === 1) {
					var x = 0;
					var y = 0;

					var pg = p.createGraphics(wX, wY); // The graphics over which the cell is rendering

					pg.fill(255);

					pg.stroke(255);

					pg.fill(255);

					// TOP    
					pg.line(x, y, x + wX, y);
					// RIGHT
					pg.line(x + wX, y, x + wX, y + wY);
					// BOTTOM
					pg.line(x + wX, y + wY, x, y + wY);
					// LEFT
					pg.line(x, y + wY, x, y);

					var mouseX = pg.mouseX;
					var mouseY = pg.mouseY;

					if (mouseX > x && mouseX < x + wX && mouseY > y && mouseY < y + wY) {
						pg.fill(200);
					} else {
						pg.fill(p.color('#6CBAE3'));
					}

					pg.rect(x, y, wX, wY)

					if (this.draw_img === 1 && this.current_type !== actions.EMPTY) {
						if (this.current_type === actions.BLOCK) {
							pg.image(mazeBlockImg, x + 10, y + 10, wX - 20, wY - 20);
							this.current_type = actions.BLOCK;
						} else if (this.current_type === actions.START) {
							pg.image(mazeStart, x + 10, y + 10, wX - 20, wY - 20);
							this.current_type = actions.START;
						} else if (this.current_type === actions.END) {
							pg.image(mazeEnd, x + 10, y + 10, wX - 20, wY - 20);
							this.current_type = actions.END;
						}
					} else {
						this.current_type = actions.EMPTY;
					}

					// Renderizes the graphics
					p.image(pg, this.x + 1, this.y + 1, wX - 1, wY - 1);

					// Curso over
					p.cursor('pointer')

					this.rendering = 0;
				}
			}

			// When displaing image
			displayImg() {
				if (this.draw_img === 0 && selectedAction !== actions.EMPTY) { // If select a cell with the option not empty to render the image occording the option
					this.current_type = selectedAction;
					this.draw_img = 1;
				} else if (this.draw_img === 1 && selectedAction !== actions.EMPTY && this.current_type === selectedAction) { // If selelect  a cell with an option not empty that is rendered to derender
					this.current_type = selectedAction;
					this.draw_img = 0;
				} else if (this.draw_img === 1 && selectedAction !== actions.EMPTY && this.current_type !== selectedAction) { // If selelect a cell with an option not empty that is rendered with a diferent option to render the image according with the new option
					this.current_type = selectedAction;
				} else if (selectedAction === actions.EMPTY) { // To render the empty option
					this.current_type = selectedAction;
					this.draw_img = 0;
				}
				this.rendering = 1;
			}
		}

		p.preload = () => {
			// Special variables 
			// mazeSize = myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth; // The resize doesnt work without this line in the preload

			// Load Images
			mazeBlockImg = p.loadImage(maze_block);
			mazeStart = p.loadImage(maze_start);
			mazeEnd = p.loadImage(maze_end);
		}

		// Method to setup the canvas for P5 ----------------------------------------------- SET UP P5 METHOD ---------------------------------------------
		p.setup = () => {
			// use parent to render the canvas in this ref
			// (without that p5 will render the canvas outside of your component)
			var canvas = p.createCanvas(mazeWidth, mazeHeight);

			for (let i = 0; i < cols; i++) {
				for (let j = 0; j < rows; j++) {
					var cell = new Cell(i, j);
					grid.push(cell);
				}
			}

			// Methods
			canvas.mouseClicked(p.handleClick);
		};

		// Method to draw the P5 canvas ----------------------------------------------------- DRAW P5 METHOD ---------------------------------------
		p.draw = () => {
			// let fps = p.frameRate();
			// let start = p.millis();

			// The maze itself, showing al the cells in the grid array
			for (let i = 0; i < grid.length; i++) {
				grid[i].show();
			}

			// The graphics with the image of the option that is selected that follows the mouse
			// var pg = p.createGraphics(50, 50)

			// if (selectedAction === actions.BLOCK) {
			// 	pg.image(mazeBlockImg, 0, 0, 50, 50);
			// } else if (selectedAction === actions.START) {
			// 	pg.image(mazeStart, 0, 0, 50, 50);
			// } else if (selectedAction === actions.END) {
			// 	pg.image(mazeEnd, 0, 0, 50, 50);
			// } else {
			// 	pg.fill(p.color('#6CBAE3'));
			// 	pg.rect(0, 0, 50, 50)
			// }

			// console.log(selectedAction)

			// // It renders the graphics that follows the mouse
			// p.image(pg, p.mouseX, p.mouseY);

			// let end = p.millis();
			// let elapsed = end - start;
			// console.log("This took: " + elapsed + "ms.")

			// p.fill(255);
			// p.textSize(15);
			// p.text("FPS: " + fps.toFixed(2), 10, p.height - 10);
			// console.log("FPS: " + fps.toFixed(2))
		};

		// Method to do something when the click is pressed over the P5 canvas
		p.handleClick = () => {
			var cell;

			var mouseX = p.mouseX;
			var mouseY = p.mouseY;

			// For to get the cell that is pressed in the canvas
			for (let i = 0; i < grid.length; i++) {
				if (mouseX > grid[i].x && mouseX < grid[i].x + wX && mouseY > grid[i].y && mouseY < grid[i].y + wY) {
					grid[i].displayImg(); // This activates the flag to display the image on the grid cell
					console.log(grid[i]);
					return;
				}
			}
		}

		// When the windows get a resize then this method activates
		p.windowResized = () => {

			// Size of the maze
			mazeSize = myRef.current.clientWidth > myRef.current.clientHeight ? myRef.current.clientHeight : myRef.current.clientWidth;

			wX = mazeSize / cols; // Width of each cell
			wY = mazeSize / rows; // Height of each cell

			// Size of the maze, num of cols and num of rows for the size of a cell 
			mazeWidth = mazeSize;
			mazeHeight = mazeSize;

			// Resize the canvas size
			p.resizeCanvas(mazeWidth, mazeHeight)

			// Changing the X and Y variables of each cell (This is for the good behavior of the handleClick method)
			for (let i = 0; i < grid.length; i++) {
				grid[i].updateXY();
			}
		}
	}

	// JSX -----------------------------------------------------------------------------------------------------------------------

	// DidMount 
	useEffect(() => {
		if (myP5) {
			myP5.remove(); // If the p5 object exist then it removes to be renew 
		}
		myP5 = new p5(sketch, myRef.current); // Create the p5 object
		console.log(currentButton)
	}, [currentButton]);

	// WillUnmount
	useEffect(() => {
		return () => {
			myP5.remove();// If the p5 object exist then it removes, when unmounting the component
		};
	}, [])

	const handleChangeAction = (action) => {
		if (action === actions.BLOCK) {
			selectedAction = action;
		} else if (action === actions.EMPTY) {
			selectedAction = action;
		} else if (action === actions.START) {
			selectedAction = action;
		} else if (action === actions.END) {
			selectedAction = action;
		}
	}

	return (
		<div className='maze-container'>
			<div className='row'>
				<div className='maze-container col-md-8'>
					{/* COMPONENT WHERE THE MAZE IS RENDERED */}
					<div className='maze d-flex justify-content-start' ref={myRef} />
				</div>
				<div className='col-md-4 d-flex justify-content-center align-items-center'>
					<h1>Your current selection<br />{selectedAction}</h1>
				</div>
			</div>
			<div className='options-palette-container'>
				<div className='options-palette'>
					<IconButton onClick={() => { handleChangeAction(actions.BLOCK); setCurrentButton(actions.BLOCK) }} style={currentButton === actions.BLOCK ? { backgroundColor: '#919191' } : {}} color='inherit'>
						<div className='d-flex flex-column align-items-center m-2'>
							<ViewAgenda />
							<h1 className='h4'>Block</h1>
						</div>
					</IconButton>
					<IconButton onClick={() => { handleChangeAction(actions.EMPTY); setCurrentButton(actions.EMPTY) }} style={currentButton === actions.EMPTY ? { backgroundColor: '#919191' } : {}} color='inherit'>
						<div className='d-flex flex-column align-items-center m-2'>
							<ViewAgenda />
							<h1 className='h4'>Empty</h1>
						</div>
					</IconButton>
					<IconButton onClick={() => { handleChangeAction(actions.START); setCurrentButton(actions.START) }} style={currentButton === actions.START ? { backgroundColor: '#919191' } : {}} color='inherit'>
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
