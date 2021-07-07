import React, { useEffect, useState } from 'react'

// Images
import maze_block from '../../../assets/maze-block.jpg'
import maze_start from '../../../assets/maze-start.jpg'
import maze_end from '../../../assets/maze-end.jpg'

export default function Cell(props) {

	// Variables que llegan en los props del componente
	const { cell, wX, wY, maze, setMaze, selectedAction, actions, isStart, isEnd, setIsStart, setIsEnd } = props;

	// i and j of the cell
	const [i, setI] = useState(cell.i)
	const [j, setJ] = useState(cell.j)

	// x and y position of the cell
	const [x, setX] = useState(i * wX);
	const [y, setY] = useState(j * wY);

	const [isImage, setIsImage] = useState(false);

	// Current cell type
	const [cellType, setCellType] = useState(cell.type);

	// Image to render
	const [image, setImage] = useState(null);

	useEffect(() => {
		setI(cell.i)
		setJ(cell.j)
		setX(i * wX);
		setY(j * wY);
		setCellType(cell.type);
	}, [wX, wY, cell])

	const handleClick = () => {
		// Get the index of the cell
		var index = maze.indexOf(cell);

		if (selectedAction !== actions.EMPTY && cellType !== selectedAction) {

			// If some cell is already a start or an end then doenst paint the start or end again
			if (isStart && selectedAction === actions.START) {
				return;
			} else if (isEnd && selectedAction === actions.END) {
				return;
			}

			if (!isImage) { // This if is just for show the image
				setIsImage(true);
			}

			// If the selectedAction is start or end then change that variables to true respectively
			if (selectedAction === actions.START) {
				setIsStart(true);
			} else if (selectedAction === actions.END) {
				setIsEnd(true);
			}

			// Change the current type of the cell
			cell.type = selectedAction;
			setCellType(selectedAction)
		} else if (selectedAction === actions.EMPTY || cellType === selectedAction) {
			if (isImage) { // This if to change the current image for another image				
				setIsImage(false);
			}

			// Change the current type of the cell
			cell.type = actions.EMPTY;
			setCellType(actions.EMPTY)
		}

		// If the current type of the image is start or end then change that variables to false respectively
		if (cellType === actions.START) {
			setIsStart(false);
		} else if (cellType === actions.END) {
			setIsEnd(false);
		}

		// Change the image
		if (selectedAction === actions.BLOCK) {
			setImage(maze_block);
		} else if (selectedAction === actions.START) {
			setImage(maze_start);
		} else if (selectedAction === actions.END) {
			setImage(maze_end);
		}

		// With this the maze get updated
		setMaze(prevValues => {
			return prevValues.map((c, i) => {
				return i === index ? cell : c;
			})
		});
	}

	// Update x and y variables
	const updateXY = () => {
		setX(i * wX);
		setY(j * wY);
	}

	return (
		<div
			onClick={handleClick}
			style={{
				border: '1px solid white',
				position: 'absolute',
				left: x,
				top: y,
				width: wX,
				height: wY,
				alignContent: 'center',
				justifyContent: 'center',
				display: 'flex'
			}}
		>
			{
				isImage && cellType !== actions.EMPTY ?
					<div
						style={{
							backgroundImage: `url(${image})`,
							backgroundSize: '100% 100%',
							width: '90%',
							height: '90%',
							alignSelf: 'center',
							zIndex: 999999
						}}
					/>
					:
					''
			}
		</div>
	)
}
