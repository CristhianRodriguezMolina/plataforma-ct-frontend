import React, { useState, useContext, useEffect, useRef } from 'react';

import './CardDataPanel.scss';
import '../alert-message.scss';

// to make API calls
import api from '../../../services/api';

import { LogicSequenceContext } from './LogicSequence';

// Alert
import Alert from '@material-ui/lab/Alert';

const CardDataPanel = props => {

    const { sequenceList, setSequenceList, logicSequence, selectedCard, cardDeleted, setCardDeleted, setSelectedCard } = useContext(LogicSequenceContext);
    const [cardName, setCardName] = useState("");

    const saveButton = useRef(null);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(true); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio


     // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    }

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000)
    }

    useEffect(()=>{
        if(!selectedCard || selectedCard === ""){
            saveButton.current.disabled = true;
        }
        else { 
            let tempCard = sequenceList.filter((card, i) => card._id === selectedCard)[0];
            if(tempCard) {
                setCardName(tempCard.name)
                saveButton.current.disabled = false;
            }
        }

    }, [selectedCard]);

    useEffect(() => {
        if(cardDeleted) {
            let tempCard = sequenceList.filter((card, i) => card._id === selectedCard)[0];
            if(tempCard) {
                setCardName(tempCard.name);
                saveButton.current.disabled = false;
            }
            else{
                let length = sequenceList.length
                if(length > 0) {
                    setCardName(sequenceList[length - 1]);
                    setSelectedCard(sequenceList[length - 1]._id);
                    saveButton.current.disabled = false;
                }
                else {
                    setCardName("");
                    setSelectedCard("");
                    saveButton.current.disabled = true;
                }
                
            }
            setCardDeleted(false);
        }
    }, [cardDeleted]);

    const saveCardInfo = async() => {
        await api.put(`/api/logic-sequence/sequence-card/${logicSequence._id}/${selectedCard}`, {
            name: cardName
        }, {headers: {'x-access-token':localStorage.getItem('token')}})
            .then((res) => {
                showSuccess(res.data.message)
                setSequenceList(res.data.updatedLogicSequence.sequence_cards);
            })
            .catch(err => {
                if(err.response){
                    showError(err.response.message);
                }
                else{
                    showError("A ocurrido un error inexperado, por favor intentelo mas tarde");

                }
                window.alert("Unexpected error!");
            })
    };

    return (
        <div className="card-data-panel-container">
            {success?  
                <Alert className="alert-message" severity="success">{successMessage}</Alert>
                : ""
            }
            {error?
                <Alert className="alert-message" severity="error">{errorMessage}</Alert>
                : ""
            }
            <h1>Panel de los datos de la tarjeta</h1>
            <p>En este panel de datos puedes cambiar los datos de la tajeta de secuencia que tienes seleccionada</p>
            <h2>Frase <span style={{color: "red"}}>*</span></h2>
            <input className="form-control" value={cardName} onChange={evt => setCardName(evt.target.value)}></input>
            <h2>Imagen <span style={{color: "rgb(129, 129, 129)"}}>(Opcional)</span></h2>
            <div className="image-container"><p>Subir imagen</p></div>
            <button ref={saveButton} className="btn btn-primary" onClick={saveCardInfo}>Guardar</button>
        </div>
    )
}

export default CardDataPanel;
    