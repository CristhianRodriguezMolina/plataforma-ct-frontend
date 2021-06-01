import React, { createContext, useEffect, useState, useRef } from 'react';


import './LogicSequence.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';
import { useParams } from "react-router-dom";
import arrayMove from 'array-move';

import {SortableContainer} from 'react-sortable-hoc';
import DynamicInput from './DynamicInput';
import AddCircleIcon from '@material-ui/icons/AddCircle';
// Boton de icono
import IconButton from '@material-ui/core/IconButton';

export const LogicSequenceContext = createContext({
    selectedCard: null,
    logicSequence: null,
    setSequenceList: null,
    sequenceList: null,
    cardDeleted: null,
    setCardDeleted: null,
    setSelectedCard: null
})

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

    useEffect(() => {
        const fetch = async() => {
            await api.get(`/api/logic-sequence/${activityId}`)
                .then((res) => {
                    setLogicSequence(res.data);
                    setSequenceList(res.data.sequence_cards);
                    setActivityName(res.data.activity_id.name);
                    setActivityDescription(res.data.activity_id.description);
                })
                .catch(err => {
                    window.alert("Unexpected error!");
                    console.error(err);
                })
        }

        if(!logicSequence){
            fetch();
        }
    }, [logicSequence]);

    const createCard = async() => {
        if(logicSequence) {
            await api.post(`/api/logic-sequence/sequence-card/${logicSequence._id}`, { 
                name: cardName,
                image: "image.jpg"
            })
            .then((res) => {
                // window.alert(res.data.message);
                setSequenceList(res.data.updatedLogicSequence.sequence_cards);
                newCardInput.current.value="";
                setCardName("");
            })
            .catch(err => {
                if (err.response) {
                    window.alert(err.response.data.message);
                }
                else {
                    console.error(err);
                }
            })
        }
    };

    const saveLogicSequence = async() => {
        await api.put(`/api/activity/${activityId}`, {
            activity: {
                name: activityName,
                description: activityDescription
            },
            child: {
                sequence_cards: sequenceList
            }
        }).then(res => {
            window.alert(res.data.message);
        }).catch(err => {
            if(err.response) {
                window.alert(err.response.data.message);
            }
            else {
                console.error(err);
            }
        });
    }

    const onSortEnd = ({oldIndex, newIndex}) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setSequenceList(arrayCopy);
    };

    const updateName = (value) => {
        console.log(value)
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
    }

    const desInputStyle = {
        width: "100%",
        fontSize: "0.8em",
        margin: "0.5em auto 0 auto",
        padding: "0.7em",
        overflow: "hidden",
        lineHeight: "1.2em",
        fontWeight: "500"
    }

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
                <div className="panels">
                    <div className="sequence-cards-container">
                        {sequenceList?
                            <SortableList distance={1} items={sequenceList} onSortEnd={onSortEnd} />:""}
                        {showInpNewCard?<input ref={newCardInput} onChange={(e) => setCardName(e.target.value)} className="form-control" placeholder={"Nombre de la tarjeta"} onKeyDown={handleKeyDownInput} autoFocus={true} onBlur={() => setShowInpNewCard(false)}></input>:
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
    