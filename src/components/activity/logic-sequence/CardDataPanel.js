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
        if(selectedCard){
            let tempCard = sequenceList.filter((card, i) => card._id === selectedCard)[0];
            if(tempCard) {
                setCardName(tempCard.name)
            }
            
        }
    }, [selectedCard]);

    const saveCardInfo = async() => {
        await api.put(`/api/logic-sequence/sequence-card/${logicSequence._id}/${selectedCard}`, {
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
            <h1>Panel de los datos de la tarjeta</h1>
            <p>En este panel de datos puedes cambiar los datos de la tajeta de secuencia que tienes seleccionada</p>
            <h2>Frase <span style={{color: "red"}}>*</span></h2>
            <input className="form-control" value={cardName} onChange={evt => setCardName(evt.target.value)}></input>
            <h2>Imagen <span style={{color: "rgb(129, 129, 129)"}}>(opcional)</span></h2>
            <div className="image-container"><p>Subir imagen</p></div>
            <button className="btn btn-primary" onClick={saveCardInfo}>Guardar</button>
        </div>
    )
}

export default CardDataPanel;
    