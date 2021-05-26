import React, { useState, useContext, useEffect } from 'react';

import './CardDataPanel.scss';

// to make API calls
import api from '../../../services/api';

import { LogicSequenceContext } from './LogicSequence';

const CardDataPanel = props => {

    const { selectedCard, logicSequence } = useContext(LogicSequenceContext);
    const [card, setCard] = useState(null);
    const [cardName, setCardName] = useState("");

    useEffect(()=>{
        console.log("selected card in dard data panel");
        console.log(selectedCard);
        if(selectedCard){
            let tempCard = logicSequence.sequence_cards.filter((card, i) => card._id === selectedCard)[0]
            console.log("CARD IN CARD DATA PANEL");
            console.log(tempCard);
            setCardName(tempCard.name)
        }
    }, [selectedCard]);

    return (
        <div className="card-data-panel-container">
            <h1>CardDataPanel</h1>
            <p>In this data panel you can change the data from a card that you have selected</p>
            <h2>Key word *</h2>
            <input value={cardName} onChange={evt => setCardName(evt.target.value)}></input>
            <h2>Image (optional)</h2>
            <input></input>
            <button>Save</button>
        </div>
    )
}

export default CardDataPanel;
    