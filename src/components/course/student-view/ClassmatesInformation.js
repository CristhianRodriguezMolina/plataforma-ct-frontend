import React, { useEffect, useState } from 'react'

// API
import api from '../../../services/api';

// COMPONENTS

// Alerta
import Alert from '@material-ui/lab/Alert';

// Student card
import StudentCard from '../student-card/StudentCard';

// No Content to show
import NoContentToShow from '../../common/NoContentToShow';

/* STUDENTS */
export default function ClassmatesInformation(props) {

    // Props for the view
    const { course } = props;

    // MENSAJES DEL MODAL
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(""); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(""); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(""); //Mensaje de proceso satisfactorio

    // Students of the course
    const [students, setStudents] = useState(null);

    // Variable to see if the info data is loading
    const [isLoading, setIsLoading] = useState(true);

    // UseEffect para obtener los alumnos del curso o en dado caso que se agreguen nuevos alumnos al curso se vuelvan a obtener
    useEffect(() => {
        if (!students) {
            fetchStudents();
        }
    }, [students])

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
            setProcessMessage('Obteniendo estudiantes...')

            const response = await api.get(`/api/course/students/${course._id}`, {
                headers: { "x-access-token": localStorage.getItem("token") },
            })

            const { students, message } = response.data;

            if (students) {
                setStudents(students);
                showSuccess(message);
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError(`Error obteniendo los estudiantes del curso`);
            }
        }
        setProcess(false);
        setProcessMessage('');
        setIsLoading(false);
    }

    return (
        <div>
            {success ? <Alert className="alert-message mb-5" severity="success">{successMessage}</Alert> : ""}
            {error ? <Alert className="alert-message" severity="error">{errorMessage}</Alert> : ""}
            {process ? <Alert className="alert-message" severity="info">{processMessage}</Alert> : ""}

            <div className="students-container">
                {/* <form className="search-form d-flex justify-content-between mb-3">
                    <div className="text-field form-group mr-3">
                        <input className="form-control text-center" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="custom-btn custom-btn-search px-3 py-1">
                            Buscar
                        </button>
                    </div>
                </form> */}
                <h1 className="h4 mb-4">Compañeros del Curso</h1>
                {
                    !isLoading ?
                        students && students.length > 0 ?
                            <>
                                <p className="students-counter"><b>{students.length}</b> estudiantes en el curso</p>
                                {
                                    students.map((student, index) => (
                                        <StudentCard
                                            forStudent={true}
                                            index={index}
                                            id={student._id}
                                            key={student._id}
                                            student={student}
                                            course={course} />
                                    ))
                                }
                            </>
                            :
                            <>
                                <NoContentToShow icon='mood_bad' messageTitle={'Sin alumnos...'} messageDes={'No hay compañeros para mostrar'} />
                            </>
                        :
                        <div className="spinner-loading" style={{ marginTop: '8em' }}>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}
