import React, { useContext, useState } from 'react';

import './SequenceCard.scss';

// to make API calls
import api from '../../../services/api';

// COMPONENTS
import { Itemtypes } from '../../../util/item';
import { LogicSequenceContext } from './LogicSequence';
import {SortableElement} from 'react-sortable-hoc';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import zIndex from '@material-ui/core/styles/zIndex';

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';


const SequenceCard = SortableElement(({value}) => {

    const { setSequenceList, logicSequence, setSelectedCard, setCardDeleted } = useContext(LogicSequenceContext);


    const handleClick = () => {
        setSelectedCard(value._id);
    };
    
    const deleteCard = async() => {
        await api.delete(`/api/logic-sequence/sequence-card/${logicSequence._id}/${value._id}`)
            .then((res) => {
                window.alert(res.data.message);
                setSelectedCard(null);
                setSequenceList(res.data.updatedLogicSequence.sequence_cards);
                setCardDeleted(true);
                
            })
            .catch(err => {
                if(err.response){
                    console.error(err.response.message);
                }
                else{
                    console.error(err);

                }
                window.alert("Unexpected error!");
            })
    }

    return (
        <div onClick={handleClick} className="sequence-card-container">
            <h1>{value.name}</h1> 
            <div className="manage-buttons-container">
                <div style={{width: "15%"}}></div>   
                <IconButton className="manage-buttons-container-1 m-0 p-0" color="secondary" aria-label="Delete" onClick={deleteCard}>
                        <DeleteIcon />
                </IconButton>
            </div>   
        </div>
    )
});

export default SequenceCard;
    