import React, { useContext, useState } from 'react';

import './SequenceCard.scss';

// to make API calls
import api from '../../../services/api';

// COMPONENTS
import { useDrag, useDrop } from 'react-dnd';
import { Itemtypes } from '../../../util/item';
import { LogicSequenceContext } from './LogicSequence';
import {SortableElement} from 'react-sortable-hoc';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import zIndex from '@material-ui/core/styles/zIndex';

const SequenceCard = SortableElement(({value}) => {

    const { setSelectedCard } = useContext(LogicSequenceContext);

    const handleClick = () => {
        console.log("sequence card clicked");
        setSelectedCard(value._id);
    };

    return (
        <div className="sequence-card-container">
            <div className="d-flex justify-content-between">
                <h1>{value.name}</h1>                
                <button onClick={handleClick} className="btn btn-info">H</button>                
            </div>
        </div>
    )
});

export default SequenceCard;
    