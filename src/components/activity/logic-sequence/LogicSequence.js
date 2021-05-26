import React, { createContext, useEffect, useState } from 'react';

import './LogicSequence.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';
import { useParams } from "react-router-dom";

export const LogicSequenceContext = createContext({
    selectedCard: null,
    sortList: null,
    logicSequence: null
})

const LogicSequence = props => {

    const [sequenceList, setSequenceList] = useState(null);
    const [logicSequence, setLogicSequence] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);


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

    const sortList = (dragged_id, target_id) => {
        console.log("dragged_id")
        console.log(dragged_id)
        console.log("target_id")
        console.log(target_id)
      
        if(dragged_id !== target_id){
         
            let tempList = [...sequenceList];
            const dragged = tempList.filter((sequence, i) => sequence._id === dragged_id);
            const draggedPosition=tempList.map((i) => {return i._id;}).indexOf(dragged_id);
            const targetPosition=tempList.map((i) => {return i._id;}).indexOf(target_id);
            tempList.splice(draggedPosition, 1)
            tempList.splice(targetPosition, 0, dragged[0]);
            console.log("dragged")
            console.log(dragged)
            console.log("targetPosition")
            console.log(targetPosition)
            console.log("tempList")
            console.log(tempList)
            setSequenceList(tempList)

            // console.log("last")
            // const lastItem = tempList[tempList.length - 1]
            // console.log(lastItem)
            // tempList.splice(tempList.length - 1, 1)
            // console.log("tempList after")
            // console.log(tempList)

            
            // setSequenceList(tempList.concat(lastItem))
        }
        

    };

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

    return (
        <LogicSequenceContext.Provider value={{sortList, selectedCard, setSelectedCard, logicSequence}}>
            <div className="logic-sequence-container">
                {logicSequence?
                    <div>
                        <h1>{logicSequence.activity_id.name}</h1>
                        <p>{logicSequence.activity_id.description}</p>
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
                        (console.log("================I DONT UNDESTAND????"),
                        console.log(sequenceList),sequenceList
                            .map((sequence, i) => (
                                <SequenceCard key={i} sequenceName={sequence.name} sequenceId={sequence._id}></SequenceCard>
                            )))
                        :
                        ""
                        }
                    <button onClick={createCard}>Create Card</button>
                    </div>
                    <CardDataPanel>
                    </CardDataPanel>
                </div>
            </div>
        </LogicSequenceContext.Provider>
    )
}

export default LogicSequence;
    