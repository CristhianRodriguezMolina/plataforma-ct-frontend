import React, { useEffect, useState } from 'react'

// COMPONENTS

// Avatar, Typografia, checkbox
import { Avatar, Typography, Checkbox } from '@material-ui/core';

export default function StudentModalCard(props) {

    const { student, setStudentsToAdd } = props;

    // Variable para la seleccion del usuario
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked) {
            setStudentsToAdd(prevValues => {
                return [...prevValues, { _id: student._id }]
            });
        } else {
            setStudentsToAdd(prevValues => {
                return prevValues.filter(value => value._id !== student._id)
            });
        }
    }, [checked]);

    // Funcion para manejar el cambio del checkbox
    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    return (
        <div className="user-modal-card">
            <div className="modal-card">
                <Avatar className="mr-2" src="https://picsum.photos/200/300" />
                <div className="mr-auto">
                    <Typography component="h1">
                        {student.first_name} {student.last_name}
                        <br />
                        ID: {student.id}
                    </Typography>
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
