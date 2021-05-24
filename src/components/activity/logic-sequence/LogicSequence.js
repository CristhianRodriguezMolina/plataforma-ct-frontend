import React, { createContext, useEffect, useState } from 'react';

import './LogicSequence.scss';

// to make API calls
import api from '../../../services/api';

import SequenceCard from './SequenceCard';
import CardDataPanel from './CardDataPanel';

export const LogicSequenceContext = createContext({
    sortList: null
})

const LogicSequence = props => {

    const [sequenceList, setSequenceList] = useState([
        {
            id:"1",
            name:"This is my first sequence"
        },
        {
            id:"2",
            name:"This is my second sequence"
        },
        {
            id:"3",
            name:"This is my third sequence"
        },
        {
            id:"4",
            name:"This is my fourth sequence"
        }
    ])

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
                </div>
                <CardDataPanel>
                </CardDataPanel>
            </div>
        </LogicSequenceContext.Provider>
    )
}

export default LogicSequence;
    