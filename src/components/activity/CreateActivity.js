import React, { useState } from 'react';

import './CreateActivity.scss';

// to make API calls
import api from '../../services/api';

const InfoBall = props => {

    const [name, setName] = useState(''); //Save the data registered in name field
    const [description, setDescription] = useState(''); //Save the data registered in description field
    const [type, setType] = useState('logic_sequence')//Save the selected option in radio buttons

    const handleSubmit = async(e) => {
        e.preventDefault(); //Prevent the form reload the webside

        console.log("name")
        console.log(name)
        console.log("description")
        console.log(description)
        console.log("type")
        console.log(type)

        //Verifying fields
        if(name.trim().localeCompare("") !== 0) {
            //Making API calls
            await api.post('/api/activity', { 
                name, 
                description, 
                type
            })
            .then((res) => {
                window.alert(res.data.message);
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
        else {
            window.alert("Name field required!");
        }
    }

    return (
        <div className="create-activity-container">
            <h1>Create new activity</h1>
            <p>An activity is a didactic exercise</p>
            <hr/>
            <form onSubmit={handleSubmit}>
                <h2>Name *</h2>
                <input type="text" id="name" name="name" onChange={evt => setName(evt.target.value)}></input>
                <h2>Description (Optional)</h2>
                <input type="text" id="description" name="description" onChange={evt => setDescription(evt.target.value)}></input>
                <hr/>
                <h2>Type *</h2>
                <input type="radio" checked="checked" id="logic_sequence" name="activity" value="logic_sequence" onChange={evt => setType(evt.target.value)}/>
                <label for="logic_sequence">Logic sequence</label><br/>
                <label for="logic_sequence">Sort the sequences according with the action</label><br/>
                <input type="radio" id="maze" name="activity" value="maze" onChange={evt => setType(evt.target.value)}/>
                <label for="maze">Maze</label><br/>
                <label for="maze">Guide the character through the maze</label><br/>
                <input type="radio" id="questionnaire" name="activity" value="questionnaire" onChange={evt => setType(evt.target.value)}/>
                <label for="questionnaire">Questionnaire</label><br/>
                <label for="questionnaire">Select the correct answer</label><br/>
                <button type="submit">Create Activity</button>
            </form>
        </div>
    )
};

export default InfoBall;