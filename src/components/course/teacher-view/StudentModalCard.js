import React, { useEffect, useState } from 'react'

// COMPONENTS

// Avatar, Typografia, checkbox
import { Avatar, Typography, Checkbox } from '@material-ui/core';

//Icons
import AccountCircle from '@material-ui/icons/AccountCircle';

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

				{student && student.image !== "" ?
					<Avatar className="student-avatar mr-2" src={`${process.env.REACT_APP_API_URL}/profile/${student.image}`} />:
					<Avatar className="student-avatar mr-2">
						<AccountCircle style={{ fontSize: 60 }}/>
					</Avatar>
				}

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
