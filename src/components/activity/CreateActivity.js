import React, { useState } from 'react';

import './CreateActivity.scss';

// to make API calls
import api from '../../services/api';

// Title card
import TitleCard from '../common/TitleCard';


const CreateActivity = (props) => {

    const [name, setName] = useState(''); //Save the data registered in name field
    const [description, setDescription] = useState(''); //Save the data registered in description field
    const [type, setType] = useState('logic_sequence')//Save the selected option in radio buttons

    

    const handleSubmit = async(e) => {
        e.preventDefault(); //Prevent form reload the webside

        console.log(type);
        //Verifying fields
        if(name.trim().localeCompare("") !== 0) {
            //Making API calls
            await api.post('/api/activity', { 
                name, 
                description, 
                type
            })
            .then((res) => {
                props.history.push(`/activity/logic-sequence/${res.data.activity_id}`);
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
        <div>
            <TitleCard 
                title="Gestión de actividades"
                color="#FA61CD"
            />  

            <div className="create-activity-container">
                
                <h1 className="title">Create new activity</h1>
                <p>A repository contains all project files, including the revision history. Already have a project repository elsewhere?</p>
                <hr/>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Nombre *</label>
                        <input className="form-control" type="text" id="name" name="name" onChange={evt => setName(evt.target.value)}></input>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Descripción (Opcional)</label>
                        <textarea className="form-control" type="text" id="description" name="description" onChange={evt => setDescription(evt.target.value)}></textarea>
                    </div>
                    <hr/>
                    <h2>Tipo de actividad *</h2>
                    <div className="radio-group">
                        <input className="radio-button" type="radio" id="logic_sequence" name="activity" value="logic_sequence" onChange={evt => setType(evt.target.value)}/>
                        <label className="title-label" for="logic_sequence">Secuencia lógica</label>
                        <label className="description-label" for="logic_sequence">Ordena las secuencias en el orden correcto en el que se realiza una acción.</label><br/>
                    </div>
                    <div className="radio-group">
                        <input className="radio-button" type="radio" id="maze" name="activity" value="maze" onChange={evt => setType(evt.target.value)}/>
                        <label className="title-label" for="maze">Laberinto</label><br/>
                        <label className="description-label" for="maze">Guia al personaje a través del laberinto.</label><br/>
                    </div>
                    <div className="radio-group">
                        <input className="radio-button" type="radio" id="questionnaire" name="activity" value="questionnaire" onChange={evt => setType(evt.target.value)}/>
                        <label className="title-label" for="questionnaire">Cuestionario</label><br/>
                        <label className="description-label" for="questionnaire">Selecciona la respuesta correcta</label><br/>
                    </div>
                    <hr/>
                    <button className="btn btn-success" type="submit">Crear Actividad</button>
                </form>
            </div>
        </div>
    )
};

export default CreateActivity;