import React, { useState, useContext, useEffect } from 'react';

import './CardDataPanel.scss';

// to make API calls
import api from '../../../services/api';

import { LogicSequenceContext } from './LogicSequence';

const CardDataPanel = props => {

    const { sequenceList, setSequenceList, logicSequence, selectedCard } = useContext(LogicSequenceContext);
    const [card, setCard] = useState(null);
    const [cardName, setCardName] = useState("");

    useEffect(()=>{
        console.log("selected card in dard data panel");
        console.log(selectedCard);
        console.log(logicSequence)
        if(selectedCard){
            let tempCard = sequenceList.filter((card, i) => card._id === selectedCard)[0];
            if(tempCard) {
                console.log("CARD IN CARD DATA PANEL");
                console.log(tempCard);
                setCardName(tempCard.name)
            }
            
        }
    }, [selectedCard]);

    const saveCardInfo = async() => {
        console.log("saveCardInfo")
        await api.put(`/api/logic_sequence/sequence_card/${logicSequence._id}/${selectedCard}`, {
            name: cardName
        })
            .then((res) => {
                window.alert(res.data.message);
                setSequenceList(res.data.updatedLogicSequence.sequence_cards);
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
    };

    return (
        <div className="card-data-panel-container">
            <h1>CardDataPanel</h1>
            <p>In this data panel you can change the data from a card that you have selected</p>
            <h2>Key word *</h2>
            <input value={cardName} onChange={evt => setCardName(evt.target.value)}></input>
            <h2>Image (optional)</h2>
            <input></input>
            <button onClick={saveCardInfo}>Save</button>
        </div>
    )
}

export default CardDataPanel;
    