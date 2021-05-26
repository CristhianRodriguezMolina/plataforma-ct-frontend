import React, { useContext, useState } from 'react';

import './SequenceCard.scss';

// to make API calls
import api from '../../../services/api';
import { useDrag, useDrop } from 'react-dnd';
import { Itemtypes } from '../../../util/item';
import { LogicSequenceContext } from './LogicSequence';
import {SortableElement} from 'react-sortable-hoc';

const SequenceCard = SortableElement(({value}) => {

    const { setSelectedCard } = useContext(LogicSequenceContext);

    const handleClick = () => {
        console.log("sequence card clicked");
        setSelectedCard(value._id);
    };

    return (
        <div className="sequence-card-container">
            <h1>{value.name}</h1>
        </div>
    )
});

export default SequenceCard;
    