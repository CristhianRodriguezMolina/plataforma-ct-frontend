import React, { useState, useEffect } from 'react';

import './MyActivities.scss';
import '../common/alert-message.scss';

//To make api calls
import api from '../../services/api';

// Title card
import TitleCard from '../common/TitleCard';

// Activities icons
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import BallotIcon from '@material-ui/icons/Ballot';
import BorderVerticalIcon from '@material-ui/icons/BorderVertical';

// Alert
import Alert from '@material-ui/lab/Alert';

const MyActivities = props => {

    const [activities, setActivities] = useState(null);
    const [showFetchButton, setShowFetchButton] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const [init, setInit] = useState(0);
    const [fin, setFin] = useState(0);
    const [count, setCount] = useState(0);
    const range = 14;

    const [isActive, setIsActive] = useState(false);

    const [currentMenu, setCurrentMenu] = useState(false);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        localStorage.setItem('navbar-color', '#f8bbd0')
    });

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

    useEffect(() => {
        if(!activities){
            const fetch = async()=>{
                await api.get('/api/activity')
                    .then((response) => {
                        setActivities(response.data.activities);
                        setCount(response.data.count);
                        if(response.data.count == 0) {
                            setLoadingCourses(false);
                            setShowFetchButton(false);
                        }
                    }).catch((error) => {
                        //Show errors ocurred during the process
                        showError("Un error ha ocurrido, por favor intentelo de nuevo mas tarde");
                        setLoadingCourses(false);
                    });
            };
            fetch();
        }
    }, [activities]);

    useEffect(() => {
        if(count !== 0){
            setFin(range);
        }
    }, [count]);

    useEffect(() => {
        if(init < fin) {
            setLoadingCourses(false);
            if(fin >= count){
                setShowFetchButton(false);
            }
        }
    }, [fin]);

    const loadActivities = () => {
        if(fin < count){
            setInit(init + range);
            setFin(fin + range);
            setLoadingCourses(true);
        }
        else{
            setShowFetchButton(false);
        }
        
    };

    const handleEdit = (activity_id) => {
        props.history.push(`/activity/logic-sequence/${activity_id}`);
    };

    const handleDelete = async(activity_id) => {
        await api.delete(`/api/activity/${activity_id}`)
        .then((res) => {
            let array = activities.filter((activity, i) => activity._id !== activity_id);
            setActivities(array);
            showSuccess(res.data.message)
        })
        .catch(err => {
            if (err.response) {
                showError(err.response.data.message);
            }
            else {
                showError("Un error ha ocurrido, por favor intentelo de nuevo mas tarde");
            }
        })
    };
    const pageClickEvent = (e) => {
        setIsActive(!isActive);
    };

    const showMenu = (activity_id) => {

        setCurrentMenu(`menu${activity_id}`);
        
        if(!isActive) {
            setIsActive(true);
        }
        // else {
        //     window.removeEventListener('click', pageClickEvent);
        // }
    };

    useEffect(() => {
        

        
      
        // If the item is active (ie open) then listen for clicks
        if (isActive) {
          window.addEventListener('click', pageClickEvent);
        }
      
        return () => {
          window.removeEventListener('click', pageClickEvent);
        }
      
      }, [isActive]);

    return (
            
        <div className="my-activities-container">
            {success?  
                <Alert className="alert-message" severity="success">{successMessage}</Alert>
                : ""
            }
            {error?
                <Alert className="alert-message" severity="error">{errorMessage}</Alert>
                : ""
            }
        <TitleCard 
                title="Mis actividades"
                color="#FA61CD"
            /> 
            <table className="activities-list">
                <thead>
                    <tr>
                        <th className="name-tag">Nombre</th>
                        <th>Descripción</th>
                        <th>Última modificación</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {activities?
                (activities.slice(0, fin).map((activity, i) => {
                    return (
                        <tr key={i}>
                            <td className="activity-name">
                                {
                                    activity.type.localeCompare("logic_sequence") === 0 ? 
                                    <AccountTreeIcon className="activity-icon"/> : activity.type.localeCompare("maze") === 0 ?
                                    <BorderVerticalIcon className="activity-icon"/> : <BallotIcon className="activity-icon"/>
                                }
                                {activity.name}
                            </td>
                            <td className="activity-description">
                                {activity.description}
                            </td>
                            <td>{activity.updatedAt.slice(0, 10)}</td>
                            <td>
                                <div className="drop-menu">
                                    <button onClick={() => showMenu(activity._id)} className="dropbutton">...</button>
                                    <div className={`dp-content ${isActive && currentMenu.localeCompare(`menu${activity._id}`) === 0? 'dp-content-active' : ''}`}>
                                        <button onClick={() => handleEdit(activity._id)}>Editar</button>
                                        <button onClick={() => handleDelete(activity._id)}>Borrar</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        
                    )
                }))
                :null
                }
                   
                </tbody>
            </table>
            
            {loadingCourses
                ?   <Alert severity="info">{"Cargando actividades... por favor espere"}</Alert>
                :   ""   
            }
            
            {showFetchButton
                ?   <button type="button" className="btn btn-light btn-block" onClick={loadActivities}>Load more</button>
                :   ""
            }
        </div>
    )
};

export default MyActivities;