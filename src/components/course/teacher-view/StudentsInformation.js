import React, { useState } from 'react'

// COMPONENTS

// Students popup
import StudentsPopup from './StudentsPopup';

// Button
import Button from '@material-ui/core/Button';

/* TECAHER */
export default function StudentsInformation(props) {

    // Props for the view
    const { course } = props;

    // Variables para controlar la apertura y cierre del modal de estudiantes
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen); 

    return (
        <div>
            <Button variant="contained" color="primary" onClick={toggle}>Modal</Button>
            <StudentsPopup course={course} isOpen={isOpen} toggle={toggle} />
        </div>
    )
}
