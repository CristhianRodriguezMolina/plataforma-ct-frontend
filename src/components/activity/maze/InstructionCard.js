import React, { useRef, useState, useEffect, useContext } from 'react';

import './InstructionCard.scss';

// Images
import forward_img from '../../../assets/forward-instruction.jpg';
import right_img from '../../../assets/right-instruction.jpg';
import left_img from '../../../assets/left-instruction.jpg';

//COMPONENTS

import { CreateMazeContext } from './Intructions';

//Sorable Element
import { SortableElement } from 'react-sortable-hoc';

const InstructionCard = SortableElement(({ value, showCheck, position }) => {

    const { instructionsToDelete, setInstructionsToDelete } = useContext(CreateMazeContext);

    const [checkCard, setCheckCard] = useState(false);

    const checkBox = useRef(null);

    // Instructions constans
    const instructions = {
        FORWARD: 'FORWARD',
        RIGHT: 'RIGHT',
        LEFT: 'LEFT'
    }

    const [image, setImage] = useState('');

    useEffect(() => {
        if (value.type === instructions.FORWARD) {
            setImage(forward_img);
        } else if (value.type === instructions.RIGHT) {
            setImage(right_img);
        } else if (value.type === instructions.LEFT) {
            setImage(left_img);
        }
    }, [value])

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
                    tempList.push(value.num);
                    setInstructionsToDelete(tempList);
                }
                else {
                    let tempList = [...instructionsToDelete];
                    let cardindex = tempList.indexOf(value.num);
                    if (cardindex !== -1) {
                        tempList.splice(cardindex, 1);
                        setInstructionsToDelete(tempList);
                    }
                }

            }
        }
    };
    return (
        <div onClick={handleClick} className="instruction-card-container">
            <input ref={checkBox} onClick={handleClick} type="checkbox" className={`${checkCard ? "show-check" : "hide-check"}`} />
            <div
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: '100% 100%',
                    width: '100%',
                    height: '100%',
                    borderRadius: '5px'
                }}
            >
            </div>
        </div>
    )
});
export default InstructionCard;