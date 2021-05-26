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
                <IconButton onClick={() => handleClick()} style={{backgroundColor: 'blue'}} arial-label="delete" color="primary">
                    <EditIcon onClick={() => handleClick()} style={{backgroundColor: 'red'}} />
                </IconButton>
            </div>
        </div>
    )
});

export default SequenceCard;
    