import React, { useEffect, useState, createContext } from 'react';

//SCSS
import './CreateMaze.scss';
import './InstructionCard.scss';

//Array move
import arrayMove from 'array-move';


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

const CreateMaze = props => {

    const [instructionsList, setInstructionsList] = useState(null);

    const [instructionsToDelete, setInstructionsToDelete] = useState([]);

    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        if (!instructionsList) {
            let tempList = [
                {
                    _id: "0",
                    name: "1"
                },
                {
                    _id: "1",
                    name: "2"
                },
                {
                    _id: "2",
                    name: "3"
                },
                {
                    _id: "3",
                    name: "4"
                },
                {
                    _id: "4",
                    name: "5"
                },
                {
                    _id: "5",
                    name: "6"
                },
                {
                    _id: "6",
                    name: "7"
                },
            ]

            setInstructionsList(tempList);
        }
    }, [instructionsList]);

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
                    <div onClick={() => handleClick(1)} className="instruction-card-container">
                        <h1>1</h1>
                    </div>
                    <div onClick={() => handleClick(2)} className="instruction-card-container">
                        <h1>2</h1>
                    </div>
                    <div onClick={() => handleClick(3)} className="instruction-card-container">
                        <h1>3</h1>
                    </div>
                </div>
                <IconButton color="primary"><DoneIcon /></IconButton>
                <IconButton color="primary"><CloseIcon /></IconButton>





                <button onClick={showCheckMarks} className="custom-btn custom-btn-success px-3 py-1">Borrar</button>
            </div>
        </CreateMazeContext.Provider>
    )
};
export default CreateMaze;