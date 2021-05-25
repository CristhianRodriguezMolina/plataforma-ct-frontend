import React, { useState } from 'react'

// API
import api from '../../services/api';

// SCSS
import './course.scss';

// COMPONENTS

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';

// Boton de icono
import IconButton from '@material-ui/core/IconButton';

// Alerta
import Alert from '@material-ui/lab/Alert';

export default function CourseCard({ course, setCourses, image, onPress }) {

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    
    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    }

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000)
    }

    // Funcion para eliminar el curso asociado a este componente
    const deleteCourse = async() => {
        try {
            setProcess(true);
            setProcessMessage('The course is deleting...');

            const response = await api.delete(`/api/course/${course._id}`);

            const { deletedCourse, message } = response.data;

            if(deletedCourse){
                setProcess(false);
                setProcessMessage('');

                // Para quitar el curso que se elimino de la lista de cursos
                setCourses(prevValues => {
                    return prevValues.filter(value => value !== course)
                })
    
                showSuccess(message);
            }else if(message){
                showError(message);
            }else{
                showError('Error inesperado en el servidor');
            }
        } catch (error) {
            showError('Error inesperado en el servidor');
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    return (
        <div className="course-card m-4 p-3" >            
            <div onClick={onPress}>
                <div className="d-flex justify-content-between align-items-center">
                    <h1 className="h5 text-left m-0 p-0">{course.name}</h1>                
                </div>
                <hr className="mx-2 my-1"/>
                <img src={image} alt="CourseImage"/>
                <div className="info mt-3">
                    <p className="text-left m-0">You are going on <b>{course.actual_unit}</b>  due <b>{course.due_date}</b></p>
                    <p className="text-left m-0">It has <b>{course.students}</b> students</p>
                    {success?
                        <Alert severity="success">{successMessage}</Alert>
                        : ""
                    }
                    {error?
                        <Alert severity="error">{errorMessage}</Alert>
                        : ""
                    }
                    {process?
                        <Alert severity="info">{processMessage}</Alert>
                        : ""
                    }
                </div>
            </div>
            <IconButton className="m-0 p-0" color="secondary" aria-label="Delete" onClick={deleteCourse}>
                    <DeleteIcon />
            </IconButton>
        </div>
    )
}
