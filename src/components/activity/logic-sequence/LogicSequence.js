import React, { useState } from 'react';

import './LogicSequence.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';
import { useDrop } from 'react-dnd';
import { Itemtypes } from '../../../util/item';

const LogicSequence = props => {

    const [{isOver}, drop] = useDrop({
        accept: Itemtypes.SEQUENCE_CARD,
        drop: (item, monitor) => console.log("something has been dropped!"),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    })

    return (
        <div className="logic-sequence-container">
            <h1>Name of the logic sequence</h1>
            <p>Desciption of the logic sequence activity</p>
            <hr></hr>
            <div className="sequence-cards-container" ref={drop}>
                <SequenceCard></SequenceCard>
                <SequenceCard></SequenceCard>
                <SequenceCard></SequenceCard>
                <SequenceCard></SequenceCard>
            </div>
            <CardDataPanel>
            </CardDataPanel>
        </div>
    )
}

export default LogicSequence;
    