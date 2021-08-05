import React, { useEffect, useState } from 'react'

// API
import api from '../../../services/api';

// COMPONENTS

// Students popup
import StudentsPopup from './StudentsPopup';

// Alerta
import Alert from '@material-ui/lab/Alert';

// Student card
import StudentCard from '../student-card/StudentCard';

// Scroll
import { Element, animateScroll as scroll, Link } from 'react-scroll'

// Materia-ui lab
import { Pagination } from '@material-ui/lab';
import SearchUser from '../../common/SearchUser';

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

    // Filtered students
    const [filteredStudents, setFilteredStudents] = useState(students);

    // Variable to manage the current page of the students list
    const [page, setPage] = useState(1);

    // Variable to set the number of pages there ir gonna be
    const [numPages, setNumPages] = useState(1);

    // Max number of students in one page
    const maxStudents = 5;

    // UseEffect para obtener los alumnos del curso o en dado caso que se agreguen nuevos alumnos al curso se vuelvan a obtener
    useEffect(() => {
        if (!students || isAddingStudents) {
            fetchStudents();
        }
    }, [students, isAddingStudents])

    // UseEffect to manage the current number of pages
    useEffect(() => {
        if (filteredStudents) {
            const newNumPages = Math.ceil(filteredStudents.length / maxStudents);

            // The number of pages is according with the number of students that are been shown 
            setNumPages(newNumPages);

            // If the current page is deleted cause a student is deleted then the current page is setted to the last
            if (page > newNumPages) {
                setPage(newNumPages);
            }
        }
    }, [filteredStudents])

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
    const scrollTo = (pos) => {
        scroll.scrollTo(100 + (100 * pos), {
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
                // All this code above is to scroll the page to the first student that is added
                let firstAddedStudentPosition = 0;
                if (students && isAddingStudents) {
                    const newStudentsAux = newStudents.map(x => x._id);
                    const studentsAux = students.map(x => x._id);
                    const difference = newStudentsAux.filter(x => studentsAux.indexOf(x) === -1);

                    firstAddedStudentPosition = newStudentsAux.indexOf(difference[0]) + 1;

                    // To get the page of the first added student
                    const firstAddedStudentPage = Math.ceil(firstAddedStudentPosition / maxStudents);

                    console.log('queputas hace aqui papi')
                    setPage(firstAddedStudentPage);

                    firstAddedStudentPosition = firstAddedStudentPosition - ((firstAddedStudentPage - 1) * maxStudents);
                }

                setStudents(newStudents);
                setFilteredStudents(newStudents);

                if (isAddingStudents) {
                    scrollTo(firstAddedStudentPosition);
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

    // Method to handle the change of the page
    const handleChangePage = (evt, page) => {
        setPage(page);
    }

    return (
        <div className='students-information'>
            {success ? <Alert className="alert-message mb-5" severity="success">{successMessage}</Alert> : ""}
            {error ? <Alert className="alert-message" severity="error">{errorMessage}</Alert> : ""}
            {process ? <Alert className="alert-message" severity="info">{processMessage}</Alert> : ""}

            <div className="students-container">
                <SearchUser users={students} filteredUsers={filteredStudents} setFilteredUsers={setFilteredStudents} setPage={setPage} />
                {filteredStudents && filteredStudents.length > 0 ?
                    <>
                        <p className="students-counter"><b>{students.length}</b> estudiantes en el curso</p>

                        {/* USES A SLICE TO JUST RENDER THE STUDENTS IN THE CURRENT PAGE */}
                        {
                            filteredStudents.slice((page - 1) * maxStudents, ((page - 1) * maxStudents) + maxStudents).map((student, index) => (
                                <StudentCard
                                    index={index + ((page - 1) * maxStudents)}
                                    id={student._id}
                                    key={student._id}
                                    student={student}
                                    setStudents={setStudents}
                                    setIsAddingStudents={setIsAddingStudents}
                                    course={course} />
                            ))
                        }
                        {
                            filteredStudents.length > maxStudents ?
                                <div className='d-flex justify-content-center mt-4'>
                                    <Pagination count={numPages} onChange={handleChangePage} page={page} color="primary" />
                                </div>
                                :
                                ''
                        }
                    </>
                    :
                    <>
                        <div className="there-is-no-students-container">
                            <h3 className="there-is-no-students">No hay alumnos para mostrar</h3>
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
