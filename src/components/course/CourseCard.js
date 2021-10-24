import React, { useState, useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './course.scss';

// animate.css package
import 'animate.css/animate.min.css';

// COMPONENTS

// Animation
import { Animated } from "react-animated-css";

// Modal de confirmación 
import AlertModal from '../common/AlertModal';

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';

// Boton de icono
import IconButton from '@material-ui/core/IconButton';

// Alerta
import Alert from '@material-ui/lab/Alert';

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

export default function CourseCard({ course, setCourses, image, onPress }) {

    // Data from the context
    const { isAdmin, isTeacher } = useContext(UserContext);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
    const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    // Variable de estado para el modal
    const [open, setOpen] = useState(false);

    // Visibility for the components animation
    const [visible, setVisible] = useState(true);

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
    const deleteCourse = async () => {
        // Toggle for the animation
        setVisible(false);
        try {
            setInfo(true);
            setInfoMessage('El curso se está borrando...');

            const response = await api.delete(`/api/course/${course._id}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

            const { deletedCourse, message } = response.data;

            if (deletedCourse) {
                // Para quitar el curso que se elimino de la lista de cursos
                setCourses(prevValues => {
                    return prevValues.filter(value => value !== course)
                })

                showSuccess(message);
            }
        } catch (error) {
            if (error.response) {
                showError('Error inesperado en el servidor');
            } else {
                showError('Error inesperado en el servidor');
            }
        }
        // Toggle for the animation
        setVisible(true);
        setInfo(false);
        setInfoMessage('');
    }

    return (
        <Animated animationIn="bounceInUp" animationOut="bounceOutDown" animationOutDuration={2000} isVisible={visible}>
            <div className="course-card my-3 mx-2 p-3" >
                <div onClick={onPress}>
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="text-overflow-1 h5 text-left m-0 p-0">{course.name}</h1>
                    </div>
                    <hr className="mx-2 my-1" />
                    <div className='img-wrapper'>
                        <img src={course.image === '' ? '/default-course-image.jpg' : `${process.env.REACT_APP_API_URL}/course-images/${course.image}`} alt="CourseImage" loading="lazy" />
                    </div>
                    <div className="info mt-3">
                        {
                            course.actual_unit ?
                                <p className="text-left m-0">Vas en la <b>{course.actual_unit}</b> y vence <b>{course.due_date}</b></p>
                                :
                                ""
                        }
                        <p className="text-left m-0">{course.units.length > 0 ? <>El curso tiene <b>{course.units.length}</b> unidades</> : <b>Aún no hay unidades</b>}</p>
                        <p className="text-left m-0">{course.students !== 0 ? <>Tiene <b>{course.students}</b> estudiantes</> : <b>El curso aún no tiene estudiantes</b>}</p>
                        {success ?
                            <Alert severity="success">{successMessage}</Alert>
                            : ""
                        }
                        {error ?
                            <Alert severity="error">{errorMessage}</Alert>
                            : ""
                        }
                        {info ?
                            <Alert severity="info">{infoMessage}</Alert>
                            : ""
                        }
                    </div>
                </div>
                {
                    isAdmin || isTeacher ?
                        <div className="text-right">
                            <Tooltip title="Borrar" aria-label="delete">
                                <IconButton className="m-0 p-0" color="secondary" aria-label="Delete" onClick={() => setOpen(!open)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </div>
                        :
                        ''
                }
                <AlertModal
                    type="delete"
                    open={open}
                    handleClose={() => setOpen(!open)}
                    message='¿Esta seguro que quiere eliminar este curso?'
                    action={deleteCourse}
                />
            </div>
        </Animated>
    )
}
