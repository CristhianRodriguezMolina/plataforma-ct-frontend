import React, { useRef, useState, useEffect, useContext } from 'react';

import './InstructionCard.scss';

//COMPONENTS

import { CreateMazeContext } from './CreateMaze';

//Sorable Element
import { SortableElement } from 'react-sortable-hoc';

const InstructionCard = SortableElement(({ value, showCheck, position }) => {

    const { instructionsToDelete, setInstructionsToDelete } = useContext(CreateMazeContext);

    const [checkCard, setCheckCard] = useState(false);

    const checkBox = useRef(null);

    useEffect(() => {
        setCheckCard(showCheck);
        if (checkBox) {
            checkBox.current.checked = false;
        }
    }, [showCheck]);

    const handleClick = () => {
        if (checkCard) {
            if (instructionsToDelete) {
                checkBox.current.checked = !checkBox.current.checked;
                if (checkBox.current.checked) {
                    let tempList = [...instructionsToDelete];
                    tempList.push(value._id);
                    setInstructionsToDelete(tempList);
                }
                else {
                    let tempList = [...instructionsToDelete];
                    let cardindex = tempList.indexOf(value._id);
                    if (cardindex != -1) {
                        tempList.splice(cardindex, 1);
                        setInstructionsToDelete(tempList);
                    }
                }

            }
        }
    };
    return (
        <div onClick={handleClick} className="instruction-card-container">
            <input ref={checkBox} type="checkbox" className={`${checkCard ? "show-check" : "hide-check"}`} />
            <h1>{value.name}</h1>
        </div>
    )
});
export default InstructionCard;