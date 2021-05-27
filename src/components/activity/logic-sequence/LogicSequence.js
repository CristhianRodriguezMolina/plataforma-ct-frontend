import React, { createContext, useEffect, useState } from 'react';

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


    const { activityId } = useParams();

    useEffect(() => {
        const fetch = async() => {
            await api.get(`/api/logic_sequence/${activityId}`)
                .then((res) => {
                    console.log(res.data.sequence_cards);
                    console.log("res.data")
                    console.log(res.data)
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
        if(logicSequence){
            await api.post(`/api/logic_sequence/sequence_card/${logicSequence._id}`, { 
                name: "My sequence card",
                image: "image.jpg"
            })
            .then((res) => {
                window.alert(res.data.message);
                console.log("New List");
                console.log(res.data.updatedLogicSequence.sequence_cards);
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
        console.log("saveLogicSequence")
        console.log(logicSequence)
        console.log(activityName)
        console.log(activityDescription)
        console.log("sequenceList")
        console.log(sequenceList)
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
            if(err.response)
            {
                window.alert(err.response.data.message);
            }
            else{
                console.log(err)
            }
        });
    }

    const onSortEnd = ({oldIndex, newIndex}) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        console.log("ARRAY COPY WHEN WE SORT");
        console.log(arrayCopy);
        setSequenceList(arrayCopy);
    };

   

    return (
        <LogicSequenceContext.Provider value={{selectedCard, setSelectedCard, logicSequence, setSequenceList, sequenceList}}>
            <div className="logic-sequence-container">
                {logicSequence?
                    <div>
                        <input value={activityName} onChange={evt => setActivityName(evt.target.value)}></input>
                        <input value={activityDescription} onChange={evt => setActivityDescription(evt.target.value)}></input>
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
    