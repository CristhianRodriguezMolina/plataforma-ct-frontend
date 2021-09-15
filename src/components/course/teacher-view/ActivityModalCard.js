import React, { useEffect, useState } from 'react'

// SCSS
import './teacherview.scss'

// COMPONENTS

// Avatar, Typografia, checkbox
import { Avatar, Typography, Checkbox } from '@material-ui/core';

// Iconos
import { AccountTree, BorderVertical, Ballot, Delete, Edit } from '@material-ui/icons';

export default function ActivityModalCard(props) {

    const { activity, setActivitiesToAdd } = props;

    // Variable para la seleccion del usuario
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked) {
            setActivitiesToAdd(prevValues => {
                return [...prevValues, { _id: activity._id }]
            });
        } else {
            setActivitiesToAdd(prevValues => {
                return prevValues.filter(value => value._id !== activity._id)
            });
        }
    }, [checked]);

    // Funcion para manejar el cambio del checkbox
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <div className="user-modal-card">
            <div className="modal-card activity-modal-card-container">
                {
                    activity && activity.type.localeCompare("logic_sequence") === 0 ?
                        <AccountTree fontSize="large" className="activity-icon" /> : activity.type.localeCompare("maze") === 0 ?
                            <BorderVertical fontSize="large" className="activity-icon" /> : <Ballot fontSize="large" className="activity-icon" />
                }
                <div className="ml-2">
                    {activity.name}
                    <br />
                    <h6 className='text-muted mt-1'>{activity.description}</h6>
                </div>
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    color="primary"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
            </div>
        </div>
    )
}
