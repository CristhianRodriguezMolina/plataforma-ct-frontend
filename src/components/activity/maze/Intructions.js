import React, { useEffect, useState, createContext } from 'react';

//SCSS
import './Intructions.scss';
import './InstructionCard.scss';

//Array move
import arrayMove from 'array-move';

// Images
import forward_img from '../../../assets/forward-instruction.jpg';
import right_img from '../../../assets/right-instruction.jpg';
import left_img from '../../../assets/left-instruction.jpg';

/**
 * Icons
 */

//Close Icon
import CloseIcon from '@material-ui/icons/Close';

//Done Icon
import DoneIcon from '@material-ui/icons/Done';

/*
 * COMPONENTS
 */

//Sorable container
import { SortableContainer } from 'react-sortable-hoc';

//Instruction card
import InstructionCard from './InstructionCard';

//Button Icon
import IconButton from '@material-ui/core/IconButton';

// Scrollbars
import { Scrollbars } from 'react-custom-scrollbars';

export const CreateMazeContext = createContext({
    instructionsToDelete: [],
    setInstructionsToDelete: null
});

const SortableList = SortableContainer(({ items, showCheck }) => {

    return (
        <div className="sorable-list-container">
            {items.map((value, index) => (
                <InstructionCard key={`item-${index}`} index={index} value={value} showCheck={showCheck} position={index} />
            ))}
        </div>
    );
});

const Intructions = props => {

    const [instructionsList, setInstructionsList] = useState(props.maze.instructions);

    const [instructionsToDelete, setInstructionsToDelete] = useState([]);

    const [showCheck, setShowCheck] = useState(false);

    // Instructions constans
    const instructions = {
        FORWARD: 'FORWARD',
        RIGHT: 'RIGHT',
        LEFT: 'LEFT'
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        let arrayCopy = [...instructionsList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setInstructionsList(arrayCopy);
        props.setMaze(prevMaze => {
            return { ...prevMaze, instructions: arrayCopy }
        });
    };

    const handleClick = (value) => {
        let tempList = [...instructionsList];

        tempList.push({
            type: `${value}`,
            num: `${tempList.length}`
        });
        setInstructionsList(tempList);
        props.setMaze(prevMaze => {
            return { ...prevMaze, instructions: tempList }
        });
    };

    const showCheckMarks = () => {
        setShowCheck(!showCheck);
    };

    const cleanInstructions = () => {
        setInstructionsList([]);
        props.setMaze(prevMaze => {
            return { ...prevMaze, instructions: [] }
        });
    }

    const handleDeleteCards = () => {

        let tempList = [...instructionsList];

        for (let i = 0; i < instructionsToDelete.length; i++) {
            let cardIndex = tempList.map((card) => { return card.num }).indexOf(instructionsToDelete[i]);
            if (cardIndex !== -1) {
                tempList.splice(cardIndex, 1);
            }
        }

        setInstructionsList(tempList);
        props.setMaze(prevMaze => {
            return { ...prevMaze, instructions: tempList }
        });
        setInstructionsToDelete([]);

        setShowCheck(false);
    };

    return (
        <CreateMazeContext.Provider value={{ instructionsToDelete, setInstructionsToDelete }}>
            <div className="instructions-maze-container">
                {instructionsList ?
                    <div className="instructions-list-container">
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                            <SortableList distance={1} items={instructionsList} onSortEnd={onSortEnd} axis='xy' showCheck={showCheck} />
                        </Scrollbars>
                        <div className={`action-button-container ${showCheck ? 'show-action-button-container' : ''}`}>
                            <button onClick={() => setShowCheck(false)}><CloseIcon style={{ fontSize: 15, color: 'rgb(100, 100, 100)' }} /></button>
                            <button onClick={handleDeleteCards}><DoneIcon style={{ fontSize: 15, color: 'rgb(100, 100, 100)' }} /></button>
                        </div>
                    </div>
                    : ""}

                <div className="instruction-buttons-container">
                    <div
                        onClick={() => handleClick(instructions.FORWARD)}
                        className="instruction-card-container"
                    >
                        <div
                            style={{
                                backgroundImage: `url(${forward_img})`,
                                backgroundSize: '100% 100%',
                                width: '100%',
                                height: '100%',
                                borderRadius: '5px'
                            }}
                        />
                    </div>
                    <div
                        onClick={() => handleClick(instructions.RIGHT)}
                        className="instruction-card-container"
                    >
                        <div
                            style={{
                                backgroundImage: `url(${right_img})`,
                                backgroundSize: '100% 100%',
                                width: '100%',
                                height: '100%',
                                borderRadius: '5px'
                            }}
                        />
                    </div>
                    <div
                        onClick={() => handleClick(instructions.LEFT)}
                        className="instruction-card-container"
                    >
                        <div
                            style={{
                                backgroundImage: `url(${left_img})`,
                                backgroundSize: '100% 100%',
                                width: '100%',
                                height: '100%',
                                borderRadius: '5px'
                            }}
                        />
                    </div>
                    <div className='d-flex flex-column'>
                        <button onClick={showCheckMarks} className="custom-btn custom-btn-primary px-3 py-1 mt-2">Borrar</button>
                        <button onClick={cleanInstructions} className="custom-btn custom-btn-delete px-3 py-1 mt-2">Limpiar</button>
                    </div>
                </div>
            </div>
        </CreateMazeContext.Provider>
    )
};
export default Intructions;