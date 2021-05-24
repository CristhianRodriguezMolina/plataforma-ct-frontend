import React, { useState } from 'react';

import './SequenceCard.scss';

// to make API calls
import api from '../../../services/api';
import { useDrag } from 'react-dnd';
import { Itemtypes } from '../../../util/item';

const SequenceCard = props => {

    const [{isDragging}, drag, opacity] = useDrag({
        type: Itemtypes.SEQUENCE_CARD,
        item: 'asd',
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })

    return (
        <div className="sequence-card-container" ref={drag} style={{opacity:isDragging?"0.5":"1"}}>
            <h1>Card name</h1>
        </div>
    )
}

export default SequenceCard;
    