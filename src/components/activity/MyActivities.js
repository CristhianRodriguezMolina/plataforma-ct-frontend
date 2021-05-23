import React from 'react'

import './MyActivities.scss';

const InfoBall = props => {

    return (
        <div className="my-activities-container">
             <table className="activities-list">
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Owner</th>
                    <th>LastModified</th>
                </tr>
                <tr>
                    <td>Activity name</td>
                    <td>Logic sequence</td>
                    <td>Me</td>
                    <td>25-05-2021</td>
                </tr>
                <tr>
                    <td>Activity name</td>
                    <td>Logic sequence</td>
                    <td>Me</td>
                    <td>25-05-2021</td>
                </tr>
                <tr>
                    <td>Activity name</td>
                    <td>Logic sequence</td>
                    <td>Me</td>
                    <td>25-05-2021</td>
                </tr>
                <tr>
                    <td>Activity name</td>
                    <td>Logic sequence</td>
                    <td>Me</td>
                    <td>25-05-2021</td>
                </tr>
            </table> 
        </div>
    )
};

export default InfoBall;