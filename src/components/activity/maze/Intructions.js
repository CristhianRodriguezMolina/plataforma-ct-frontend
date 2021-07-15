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

    const [instructionsList, setInstructionsList] = useState([]);

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
    };

    const handleClick = (value) => {
        let tempList = [...instructionsList];

        tempList.push({
            name: `${value}`,
            _id: `${tempList.length}`
        });
        setInstructionsList(tempList);
    };

    const showCheckMarks = () => {
        setShowCheck(!showCheck);
    };

    const handleDeleteCards = () => {

        let tempList = [...instructionsList];

        for (let i = 0; i < instructionsToDelete.length; i++) {
            let cardIndex = tempList.map((card) => { return card._id }).indexOf(instructionsToDelete[i]);
            if (cardIndex !== -1) {
                tempList.splice(cardIndex, 1);
            }
        }

        setInstructionsList(tempList);
        setInstructionsToDelete([]);

        setShowCheck(false);
    };

    return (
        <CreateMazeContext.Provider value={{ instructionsToDelete, setInstructionsToDelete }}>
            <div className="create-maze-container">
                {instructionsList ?
                    <div className="instructions-list-container">
                        <SortableList distance={1} items={instructionsList} onSortEnd={onSortEnd} axis='xy' showCheck={showCheck} />
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
                            }}
                        />
                    </div>
                    <button onClick={showCheckMarks} className="custom-btn custom-btn-primary px-3 py-1 mt-2">Borrar</button>
                </div>
            </div>
        </CreateMazeContext.Provider>
    )
};
export default Intructions;