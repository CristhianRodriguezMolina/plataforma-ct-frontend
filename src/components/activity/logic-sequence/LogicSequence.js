import React, { createContext, useEffect, useState } from 'react';

import './LogicSequence.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';
import { useLocation } from "react-router-dom";

export const LogicSequenceContext = createContext({
    sortList: null
})

const LogicSequence = props => {

    const [sequenceList, setSequenceList] = useState([]);
    const [logicSequence, setLogicSequence] = useState(null);
    //Data passed through the history.push
    const location = useLocation();

    useEffect(() => {
        const fetch = async() => {
            let array = window.location.href.split("/");
            let activity_id = array[array.length - 1];
            await api.get(`/api/logic_sequence/${activity_id}`)
                .then((res) => {
                    console.log(res.data.sequence_cards);
                    list = res.data.sequence_cards;
                    console.log("res.data")
                    console.log(res.data)
                    setLogicSequence(res.data);
                })
                .catch(err => {
                    window.alert("Unexpected error!");
                    console.error(err);
                })
        }
        
        let list = []
        if(location.state == undefined){
            fetch();
        }
        else{
            list = location.state.data.savedChild.savedLogicSequence.sequence_cards;
        }

        if(logicSequence == undefined){
            fetch();
        }
        
        setSequenceList(list);
    }, [location, logicSequence]);

    const sortList = (dragged_id, target_id) => {
        console.log("dragged_id")
        console.log(dragged_id)
        console.log("target_id")
        console.log(target_id)
      
        if(dragged_id!== target_id){
         
            
            const dragged = sequenceList.filter((sequence, i) => sequence.id === dragged_id)
            const draggedPosition=sequenceList.map((i) => {return i.id;}).indexOf(dragged_id);
            const targetPosition=sequenceList.map((i) => {return i.id;}).indexOf(target_id);
            sequenceList.splice(draggedPosition, 1)
            sequenceList.splice(targetPosition, 0, dragged[0]);
            console.log("dragged")
            console.log(dragged)
            console.log("targetPosition")
            console.log(targetPosition)
            console.log("sequenceList")
            console.log(sequenceList)

            console.log("last")
            const lastItem = sequenceList[sequenceList.length - 1]
            console.log(lastItem)
            sequenceList.splice(sequenceList.length - 1, 1)
            console.log("sequenceList after")
            console.log(sequenceList)

            
            setSequenceList(sequenceList.concat(lastItem))
        }
        

    };

    const createCard = async() => {
        if(logicSequence != undefined){
            await api.post(`/api/logic_sequence/sequence_card/${logicSequence._id}`, { 
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

    return (
        <LogicSequenceContext.Provider value={{sortList}}>
            <div className="logic-sequence-container">
                <h1>Name of the logic sequence</h1>
                <p>Desciption of the logic sequence activity</p>
                <hr></hr>
                <div className="sequence-cards-container">
                    {sequenceList
                        .map((sequence, i) => (
                            <SequenceCard sequenceName={sequence.name} sequenceId={sequence.id}></SequenceCard>
                        ))}
                <button onClick={createCard}>Create Card</button>
                </div>
                <CardDataPanel>
                </CardDataPanel>
            </div>
        </LogicSequenceContext.Provider>
    )
}

export default LogicSequence;
    