import React, { useContext, useState } from 'react';

import './SequenceCard.scss';

// to make API calls
import api from '../../../services/api';
import { useDrag, useDrop } from 'react-dnd';
import { Itemtypes } from '../../../util/item';
import { LogicSequenceContext } from './LogicSequence';

const SequenceCard = props => {

    const { sortList, setSelectedCard } = useContext(LogicSequenceContext);

    const [{isDragging}, drag] = useDrag({
        type: Itemtypes.SEQUENCE_CARD,
        item: {
            id: props.sequenceId
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    const [{isOver}, drop] = useDrop({
        accept: Itemtypes.SEQUENCE_CARD,
        drop: (item, monitor) => {
            console.log("something has been dropped!");
            sortList(item.id, props.sequenceId);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    })

    const handleClick = () => {
        console.log("sequence card clicked");
        setSelectedCard(props.sequenceId);
    };

    return (
        <div className="sequence-card-container" ref={drop} style={{
            backgroundColor: isOver?"red":"white",
          }}>
            <div  onClick={handleClick} className="secundary-sequence-card-container" ref={drag} style={{opacity:isDragging?"0.5":"1"}}>
                <h1>{props.sequenceName}</h1>
            </div>
        </div>
    )
}

export default SequenceCard;
    