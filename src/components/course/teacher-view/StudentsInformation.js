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

// Student card
import StudentCard from '../student-card/StudentCard';

// Scroll
import { Element, animateScroll as scroll, Link } from 'react-scroll'

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

    // Students of the course
    const [students, setStudents] = useState(null);

    // UseEffect para obtener los alumnos del curso o en dado caso que se agreguen nuevos alumnos al curso se vuelvan a obtener
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

    // Method to do a smooth scroll
    const scrollTo = () => {
        scroll.scrollTo(500, {
            duration: 500,
            smooth: true,
            containerId: 'idScrollContainer'
        })
    }

    const fetchStudents = async () => {
        try {
            setProcess(true);
            setProcessMessage('Obteniendo estudiantes...')

            const response = await api.get(`/api/course/students/${course._id}`, {
                headers: { "x-access-token": localStorage.getItem("token") },
            })

            const { students: newStudents, message } = response.data;

            if (newStudents) {
                if (students && isAddingStudents) {
                    const newStudentsAux = newStudents.map(x => x._id);
                    const studentsAux = students.map(x => x._id);
                    let difference = newStudentsAux.filter(x => studentsAux.indexOf(x) === -1)
                    console.log(difference)
                }

                setStudents(newStudents);

                if (isAddingStudents) {
                    scrollTo();
                }

                showSuccess(message);
            }
        } catch (error) {
            if (error.response) {
                console.log(`Error obteniendo los estudiantes del curso: ${error}`);
                showError(error.response.data.message);
            } else {
                console.log(`Error obteniendo los estudiantes del curso: ${error}`);
                showError(`Error obteniendo los estudiantes del curso`);
            }
        }
        setProcess(false);
        setProcessMessage('');
    }

    return (
        <div className='students-information'>
            {success ? <Alert className="alert-message mb-5" severity="success">{successMessage}</Alert> : ""}
            {error ? <Alert className="alert-message" severity="error">{errorMessage}</Alert> : ""}
            {process ? <Alert className="alert-message" severity="info">{processMessage}</Alert> : ""}

            <div className="students-container">
                <form className="search-form d-flex justify-content-between mb-3">
                    <div className="text-field form-group mr-3">
                        <input className="form-control text-center" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn-search custom-btn custom-btn-search">
                            Buscar
                        </button>
                    </div>
                </form>
                {students && students.length > 0 ?
                    <>
                        <p className="students-counter"><b>{students.length}</b> estudiantes en el curso</p>
                        {
                            students.map((student, index) => (
                                <StudentCard
                                    index={index}
                                    id={student._id}
                                    key={student._id}
                                    student={student}
                                    setStudents={setStudents}
                                    setIsAddingStudents={setIsAddingStudents}
                                    course={course} />
                            ))
                        }
                    </>
                    :
                    <>
                        <div className="there-is-no-students-container">
                            <h3 className="there-is-no-students">Aún no hay alumnos en el curso</h3>
                        </div>
                    </>
                }
            </div>

            <button className="custom-btn custom-btn-success btn-modal-add-student" onClick={toggle}>Agregar alumnos</button>
            <StudentsPopup
                course={course}
                isOpen={isOpen}
                toggle={toggle}
                setCourseStudents={setStudents}
                isAddingStudents={isAddingStudents}
                setIsAddingStudents={setIsAddingStudents} />
        </div>
    )
}
