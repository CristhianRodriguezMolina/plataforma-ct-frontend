import React, { useEffect, useState } from 'react'

// API
import api from '../../../services/api';

// COMPONENTS

// Students popup
import StudentsPopup from './StudentsPopup';

// Button
import Button from '@material-ui/core/Button';

// Alerta
import Alert from '@material-ui/lab/Alert';

/* TECAHER */
export default function StudentsInformation(props) {

    // Props for the view
    const { course } = props;

    // MENSAJES DEL MODAL
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(""); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(""); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(""); //Mensaje de proceso satisfactorio

    // Variables para controlar la apertura y cierre del modal de estudiantes
    const [isAddingStudents, setIsAddingStudents] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    const [students, setStudents] = useState(null);

    useEffect(() => {
        if (!students || isAddingStudents) {
            fetchStudents();
        }
    }, [students, isAddingStudents])

    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true); //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => {
            //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000);
    };

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true); //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => {
            //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000);
    };

    const fetchStudents = async () => {
        try {
            setProcess(true);
            setErrorMessage('Obteniendo estudiantes...')

            const response = await api.get(`/api/course/students/${course._id}`, {
                headers: { "x-access-token": localStorage.getItem("token") },
            })

            const { students, message } = response.data;

            if (students) {
                setStudents(students);
                showSuccess(message);
            } else {
                showError(message);
            }
        } catch (error) {
            if (error.response) {
                console.log(`Error obteniendo los estudiantes del curso: ${error}`);
                showError(error.response.message);
            } else {
                console.log(`Error obteniendo los estudiantes del curso: ${error}`);
                showError(`Error obteniendo los estudiantes del curso`);
            }
        }
        setProcess(false);
        setErrorMessage('')
    }

    return (
        <div>
            {success ? <Alert className="alert-message mb-5" severity="success">{successMessage}</Alert> : ""}
            {error ? <Alert className="alert-message" severity="error">{errorMessage}</Alert> : ""}
            {process ? <Alert className="alert-message" severity="info">{processMessage}</Alert> : ""}

            {students ?
                students.map(student => (
                    <div>
                        {student.first_name} {student.last_name}
                    </div>
                ))
                :
                ""
            }

            <Button variant="contained" color="primary" onClick={toggle}>Modal</Button>
            <StudentsPopup course={course} isOpen={isOpen} toggle={toggle} setIsAddingStudents={setIsAddingStudents} />
        </div>
    )
}
