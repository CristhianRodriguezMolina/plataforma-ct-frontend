import React, { createContext, useEffect, useState, useRef } from 'react';


import './LogicSequence.scss';
import '../../common/alert-message.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';
import { useParams } from "react-router-dom";
import arrayMove from 'array-move';

import {SortableContainer} from 'react-sortable-hoc';
import DynamicInput from '../../common/DynamicInput';
import AddCircleIcon from '@material-ui/icons/AddCircle';
// Boton de icono
import IconButton from '@material-ui/core/IconButton';


// Alert
import Alert from '@material-ui/lab/Alert';

export const LogicSequenceContext = createContext({
    selectedCard: null,
    logicSequence: null,
    setSequenceList: null,
    sequenceList: null,
    cardDeleted: null,
    setCardDeleted: null,
    setSelectedCard: null
});

const SortableList = SortableContainer(({items}) => {
    
    return (
        <div>
        {items.map((value, index) => (
            <SequenceCard key={`item-${index}`} index={index} value={value} />
        ))}
        </div>
    );
});

const LogicSequence = props => {

    const [sequenceList, setSequenceList] = useState(null);
    const [logicSequence, setLogicSequence] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [cardDeleted, setCardDeleted] = useState(null);

    const [activityName, setActivityName] = useState("");
    const [activityDescription, setActivityDescription] = useState("");

    const [cardName, setCardName] = useState("");

    const [showInpNewCard, setShowInpNewCard] = useState(false);
    
    const { activityId } = useParams();

    const newCardInput = useRef(null); 

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    const [loading, setLoading] = useState(true);


     // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    };

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000)
    };

    const showInfo = (message) => {
        setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setProcess(false);
            setProcessMessage("");
        }, 2000)
    };

    useEffect(() => {
        const fetch = async() => {
            await api.get(`/api/logic-sequence/${activityId}`, {headers: {'x-access-token':localStorage.getItem('token')}})
                .then((res) => {
                    setLogicSequence(res.data);
                    setSequenceList(res.data.sequence_cards);
                    setActivityName(res.data.activity_id.name);
                    setActivityDescription(res.data.activity_id.description);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    showError("No se han podido cargar las tajetas, por favor intentelo mas tarde!");
                })
        }

        if(!logicSequence){
            fetch();
        }
    }, [logicSequence]);

    const createCard = async() => {
        if(cardName && cardName.trim().localeCompare("") !== 0) {
            if(logicSequence) {
                await api.post(`/api/logic-sequence/sequence-card/${logicSequence._id}`, { 
                    name: cardName
                })
                .then((res) => {
                    setSequenceList(res.data.updatedLogicSequence.sequence_cards);
                    newCardInput.current.value="";
                    setCardName("");
                })
                .catch(err => {
                    if (err.response) {
                        showError(err.response.data.message);
                    }
                    else {
                        showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
                    }
                })
            }
        } else {
            setCardName("");
            setShowInpNewCard(false);
        }
    };

    const saveLogicSequence = async() => {
        if(activityName && activityName.trim().localeCompare("") !== 0) {
            await api.put(`/api/activity/${activityId}`, {
                activity: {
                    name: activityName,
                    description: activityDescription
                },
                child: {
                    sequence_cards: sequenceList
                }
            }).then(res => {
                showSuccess(res.data.message);
            }).catch(err => {
                if(err.response) {
                    showError(err.response.data.message);
                }
                else {
                    showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
                }
            });
        }
        else {
            showInfo("El nombre de la actividad es requerido");
        }
    };

    const onSortEnd = ({oldIndex, newIndex}) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setSequenceList(arrayCopy);
    };

    const updateName = (value) => {
        setActivityName(value);
    };

    const updateDes = (value) => {
        setActivityDescription(value);
    };


    const nameInputStyle = {
        textAlign: "center",
        width: "80%",
        fontSize: "1.7em",
        margin: "0.5em auto 0 auto",
        padding: "0.4em",
        lineHeight: "1.2em",
        fontWeight: "600"
    };

    const desInputStyle = {
        width: "100%",
        fontSize: "0.8em",
        margin: "0.5em auto 0 auto",
        padding: "0.7em",
        overflow: "hidden",
        lineHeight: "1.2em",
        fontWeight: "500",
        minHeight: "2.5em"
    };

    const createCardHandler = () => {
        setShowInpNewCard(true);
    };

    const handleKeyDownInput = (event) => {
        if (event.key === 'Enter') {
            createCard()
        }
    };

    return (
        <LogicSequenceContext.Provider value={{selectedCard, setSelectedCard, logicSequence, setSequenceList, sequenceList, cardDeleted, setCardDeleted}}>
            <div className="logic-sequence-container">
                {success?  
                    <Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
                    : ""
                }
                {error?
                    <Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
                    : ""
                }
                {process?
                    <Alert className="alert-message logic-sequence-alert" severity="info">{processMessage}</Alert>
                    : ""
                }
                
                {logicSequence?
                    <div className="logic-sequence-info">
                        <DynamicInput dynamicInputValue={activityName} dynamicInputStyle={nameInputStyle} sendValue={updateName}></DynamicInput>
                        <DynamicInput dynamicInputValue={activityDescription} dynamicInputStyle={desInputStyle} sendValue={updateDes}></DynamicInput>
                    </div>
                    :
                    <div>
                        <h1 style={nameInputStyle} >Description of the logic sequence activity</h1>
                        <p style={desInputStyle} >Name of the logic sequence</p>
                    </div>}
                <hr className="hr-bar"></hr>
                {loading?
                    <Alert severity="info">{"Cargando tarjetas, por favor espere"}</Alert>
                    : ""
                }
                <div className="panels">
                    <div className="sequence-cards-container">
                        {sequenceList?
                            <SortableList distance={1} items={sequenceList} onSortEnd={onSortEnd} />:""}
                        {showInpNewCard?
                            <input ref={newCardInput} value={cardName} onChange={(e) => setCardName(e.target.value)} className="form-control" 
                                placeholder={"Nombre de la tarjeta"} onKeyDown={handleKeyDownInput} autoFocus={true} onBlur={() => setShowInpNewCard(false)}>
                            </input>:
                            <div className="create-card-button">
                                <div style={{width: "42%"}}></div>
                                <IconButton color="primary" aria-label="Create" onClick={createCardHandler}>
                                        <AddCircleIcon style={{ fontSize: 40}}/>
                                </IconButton>
                            </div>
                        }
                    </div>
                    <CardDataPanel>
                    </CardDataPanel>

                </div>
                <hr className="hr-bar"></hr>
                <button className="save-button btn btn-primary" onClick={() => saveLogicSequence()}>Guardar cambios generales</button>
            </div>
        </LogicSequenceContext.Provider>
    )
}

export default LogicSequence;
    