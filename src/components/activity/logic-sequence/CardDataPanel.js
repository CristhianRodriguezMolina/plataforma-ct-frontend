import React, { useState, useContext, useEffect } from 'react';

import './CardDataPanel.scss';

// to make API calls
import api from '../../../services/api';

import { LogicSequenceContext } from './LogicSequence';

const CardDataPanel = props => {

    const { selectedCard, logicSequence } = useContext(LogicSequenceContext);
    const [card, setCard] = useState(null);

    useEffect(()=>{
        if(logicSequence){
            setCard(logicSequence.sequence_cards.filter((card, i) => card.id === selectedCard)[0]);
        }
    }, [card]);

    const doSomething = () => {
        console.log("isClicked");
    };

    return (
        <div onClick={doSomething} className="card-data-panel-container">
            <h1>CardDataPanel</h1>
            <p>In this data panel you can change the data from a card that you have selected</p>
            <h2>Key word *</h2>
            <input></input>
            <h2>Image (optional)</h2>
            <input></input>
            <button>Save</button>
        </div>
    )
}

export default CardDataPanel;
    