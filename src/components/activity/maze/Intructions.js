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

// Scrollbars
import { Scrollbars } from 'react-custom-scrollbars';

// Materia ui alert
import { Alert } from '@material-ui/lab';

// Alert modal
import AlertModal from '../../common/AlertModal';

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

    // MENSAJES DE LA VISTA
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso

    // List of instructions
    const [instructionsList, setInstructionsList] = useState([]);

    // Instructions that will be deleted
    const [instructionsToDelete, setInstructionsToDelete] = useState([]);

    // Flag to show the checks on the instruccions to delete
    const [showCheck, setShowCheck] = useState(false);

    // variable to confirmation modal to clean the instructions
    const [open, setOpen] = useState(false);

    // Instructions constans
    const instructions = {
        FORWARD: 'FORWARD',
        RIGHT: 'RIGHT',
        LEFT: 'LEFT'
    }

    useEffect(() => {
        if (instructionsList.length === 0) {
            if (props.maze !== null && props.maze !== undefined) {
                setInstructionsList(props.maze.instructions);
            } else {
                setInstructionsList(props.instructions);
            }
        }
    }, [instructionsList])

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

    const updateMazeInstructions = (newInstructions) => {
        if (props.maze !== null && props.maze !== undefined) {
            props.setMaze(prevMaze => {
                return { ...prevMaze, instructions: newInstructions }
            });
        } else {
            props.setInstructions(newInstructions);
        }
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {
        let arrayCopy = [...instructionsList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setInstructionsList(arrayCopy);
        updateMazeInstructions(arrayCopy);
    };

    const handleClick = (value) => {
        if (instructionsList.length >= props.cols * props.rows) {
            showError('LLegó al número de instrucciones')
            return;
        }

        let tempList = [...instructionsList];

        tempList.push({
            type: `${value}`,
            num: `${tempList.length}`
        });
        setInstructionsList(tempList);
        updateMazeInstructions(tempList);
    };

    const showCheckMarks = () => {
        setInstructionsToDelete([]);
        setShowCheck(!showCheck);
    };

    const cleanInstructions = () => {
        setInstructionsList([]);
        updateMazeInstructions([]);
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
        updateMazeInstructions(tempList);
        setInstructionsToDelete([]);

        setShowCheck(false);
    };

    // Method to handle the cleaning of the instructions
    const handleCleanInstructions = () => {
        if (instructionsList.length === 0) {
            showInfo('Primero pon una instrucción');
        } else {
            setOpen(!open);
        }
    }

    return (
        <CreateMazeContext.Provider value={{ instructionsToDelete, setInstructionsToDelete }}>
            <div className="instructions-maze-container">
                {error ?
                    <Alert className="alert-message" severity="error">{errorMessage}</Alert>
                    : ""
                }
                {process ?
                    <Alert className="alert-message" severity="info">{processMessage}</Alert>
                    : ""
                }

                {/* ALERT MODAL TO CLEAN ALL THE INSTRUCTIONS */}
                <AlertModal
                    type="delete"
                    open={open}
                    handleClose={() => setOpen(!open)}
                    message='¿Está seguro que quiere limpiar las instrucciones?'
                    actionText='Limpiar'
                    action={cleanInstructions}
                />

                {instructionsList ?
                    <div className="instructions-list-container">
                        <Scrollbars style={{ width: '100%', height: '100%' }}>
                            <SortableList distance={10} items={instructionsList} onSortEnd={onSortEnd} axis='xy' showCheck={showCheck} />
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
                        <button onClick={handleCleanInstructions} className="custom-btn custom-btn-delete px-3 py-1 mt-2">Limpiar</button>
                    </div>
                </div>
            </div>
        </CreateMazeContext.Provider>
    )
};
export default Intructions;
