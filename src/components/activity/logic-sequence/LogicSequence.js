import React, { createContext, useEffect, useRef, useState } from 'react';


import './LogicSequence.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';
import { useParams } from "react-router-dom";
import arrayMove from 'array-move';

import {SortableContainer} from 'react-sortable-hoc';

export const LogicSequenceContext = createContext({
    selectedCard: null,
    logicSequence: null,
    setSequenceList: null,
    sequenceList: null
})

const SortableList = SortableContainer(({items}) => {
    
    return (
        <ul>
        {items.map((value, index) => (
            <SequenceCard key={`item-${index}`} index={index} value={value} />
        ))}
        </ul>
    );
    });
const LogicSequence = props => {

    const [sequenceList, setSequenceList] = useState(null);
    const [logicSequence, setLogicSequence] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    const [activityName, setActivityName] = useState("");
    const [activityDescription, setActivityDescription] = useState("");

    const [showNameInput, setShowNameInput] = useState(false);
    const [showDesInput, setShowDesInput] = useState(false);
    const nameInput = useRef(null);
    const desInput = useRef(null);

    const popcorn = document.querySelector('#popcorn');
    const tooltip = document.querySelector('#tooltip');


    const { activityId } = useParams();

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
                name: "My sequence card",
                image: "image.jpg"
            })
            .then((res) => {
                window.alert(res.data.message);
                setSequenceList(res.data.updatedLogicSequence.sequence_cards);
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

    const handleKeyDownNameInput = (event) => {
        if (event.key === 'Enter') {
            setShowNameInput(false);
        }

        event.target.style.height = 'inherit';
        event.target.style.height = `${event.target.scrollHeight}px`;

    }

    const handleKeyDownDesInput = (event) => {
        if (event.key === 'Enter') {
            setShowDesInput(false);
        }
    }

    const handleNameInputClick = () => {
        const nInput = document.getElementById('nInput');
        if(nInput) {
            nInput.style.height = `${nInput.scrollHeight}px`;
        }
        setShowNameInput(true);
    }

    useEffect(() => {
        if(showNameInput) {
            nameInput.current.focus();
            nameInput.current.selectionStart = nameInput.current.value.length;
            nameInput.current.selectionEnd = nameInput.current.value.length;
        }
    }, [showNameInput]);
   

    useEffect(() => {
        if(showDesInput) {
            desInput.current.focus();
            desInput.current.selectionStart = desInput.current.value.length;
            desInput.current.selectionEnd = desInput.current.value.length;
        }
    }, [showDesInput]);

    return (
        <LogicSequenceContext.Provider value={{selectedCard, setSelectedCard, logicSequence, setSequenceList, sequenceList}}>
            <div className="logic-sequence-container">
                {logicSequence?
                    <div className="logic-sequence-info">
                        {showNameInput? 
                        <textarea id="nInput" type="text" rows={1} ref={nameInput} onKeyDown={handleKeyDownNameInput} className="form-control activity-name-input" value={activityName} onBlur={() => setShowNameInput(false)} onChange={evt => setActivityName(evt.target.value)}></textarea>
                        : <h1 onClick={handleNameInputClick} className="activity-name-label">{activityName}</h1> }
                        
                        {showDesInput? 
                        <textarea ref={desInput} onKeyDown={handleKeyDownDesInput} className="form-control activity-description-input" onBlur={() => setShowDesInput(false)} value={activityDescription} onChange={evt => setActivityDescription(evt.target.value)}></textarea>
                        : <h1 onClick={() => setShowDesInput(true)} className="activity-description-label">{activityDescription}</h1> }
                    </div>
                    :
                    <div>
                        <h1>Description of the logic sequence activity</h1>
                        <p>Name of the logic sequence</p>
                    </div>}
                <hr></hr>
                <div className="panels">
                    <div className="sequence-cards-container">
                        {sequenceList?
                            <SortableList items={sequenceList} onSortEnd={onSortEnd} />:""}
                        
                        <button onClick={() => createCard()}>Create Card</button>
                    </div>
                    <CardDataPanel>
                    </CardDataPanel>

                </div>
                <button onClick={() => saveLogicSequence()}>Save changes</button>
            </div>
        </LogicSequenceContext.Provider>
    )
}

export default LogicSequence;
    