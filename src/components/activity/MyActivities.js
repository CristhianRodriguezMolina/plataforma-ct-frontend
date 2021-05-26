import React, { useState, useEffect } from 'react';

import './MyActivities.scss';

//To make api calls
import api from '../../services/api';

const MyActivities = props => {

    const [activities, setActivities] = useState(null);
    const [showFetchButton, setShowFetchButton] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const [init, setInit] = useState(0);
    const [fin, setFin] = useState(0);
    const [count, setCount] = useState(0);
    const range = 10;

    useEffect(() => {
        if(!activities){
            const fetch = async()=>{
                await api.get('/api/activity')
                    .then((response) => {
                        setActivities(response.data.activities);
                        setCount(response.data.count);
                    }).catch((error) => {
                        //Show an error during the process
                        console.log("Un error ha ocurrido, por favor intentelo de nuevo mas tarde");
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

    const handleActivity = (activity_id) => {
        console.log("activity_id")
        console.log(activity_id)
    };
    return (
        <div className="my-activities-container">
            <table className="activities-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Owner</th>
                        <th>LastModified</th>
                    </tr>
                </thead>
                <tbody>
                {activities?
                (activities.slice(0, fin).map((activity, i) => {
                    return (
                        <tr key={i}>
                            <td>{activity.name}</td>
                            <td>{activity.type.localeCompare("logic_sequence") === 0 ? 'Logic sequence' : activity.type.localeCompare("maze") === 0 ? 'Maze' : 'Questionnaire'}</td>
                            <td>Me</td>
                            <td>{activity.updatedAt}</td>
                            <td>
                                <button onClick={() => handleActivity(activity._id)}>Edit</button>
                            </td>
                        </tr>
                    )
                }))
                :null
                }
                </tbody>
            </table>
            {loadingCourses
                ?   <div key="spinner" className="spinner-border loading-spinner" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
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