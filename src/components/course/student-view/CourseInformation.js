import React, { useEffect, useState } from 'react'

// API
import api from '../../../services/api';

// SCSS
import './studentview.scss';

// Util
import * as Util from '../../../util/util'

// COMPONENTS

// Material UI components
import { Typography, Avatar } from '@material-ui/core';

// Alert
import { Alert } from '@material-ui/lab';
import NoContentToShow from '../../common/NoContentToShow';

// Icons
import { AccountCircle } from '@material-ui/icons';

/* STUDENT */
export default function CourseInformation(props) {

    // Parametros del componente
    const { course } = props;

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error

    // Course teacher
    const [teacher, setTeacher] = useState(null);

    // Variable to see if the info data is loading
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!teacher) {
            fetchTeacher();
        }
    }, [teacher])

    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    }

    const fetchTeacher = async () => {
        try {
            const response = await api.get(`/api/course/teacher/${course.creator}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

            const { message, teacher } = response.data;

            if (teacher) {
                setTeacher(teacher);
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError(`Ha ocurrido un error obteniendo los datos del profesor`);
            }
        }
        setIsLoading(false);
    }

    return (
        <div className='course-information container pt-4 px-5'>
            {error ?
                <Alert className='alert-message' severity="error">{errorMessage}</Alert>
                : ""
            }

            <h1 className="h4">Información General del Curso</h1>
            <hr />
            <Typography variant="subtitle1">
                <p className='my-4'>{course.description}</p>
            </Typography>
            <hr />
            <h1 className="h5 text-center">Profesor del curso</h1>
            <Typography variant="subtitle1">
                {
                    !isLoading ?
                        teacher ?
                            <>
                                <div className="d-flex">
                                    {teacher.image !== "" ?
                                        <Avatar className="course-info-avatar" src={`${process.env.REACT_APP_API_URL}/profile/${teacher.image}`} /> :
                                        <Avatar className="course-info-avatar">
                                            <AccountCircle style={{ fontSize: 60 }} />
                                        </Avatar>
                                    }
                                    <div>
                                        <p className='m-0 ml-4 mb-2 p-0'><b>{teacher.first_name} {teacher.last_name}</b></p>
                                        <p className='m-0 ml-4 mb-2 p-0 text-muted'>Género: {Util.getGenre(teacher.genre)}</p>
                                    </div>
                                </div>
                                <div className='mt-3'>
                                    <p className='m-0 mb-2 p-0'>Teléfono: {teacher.phone !== '' ? <b>{teacher.phone}</b> : <b className='text-muted'>No tiene teléfono</b>}</p>
                                    <p className='m-0 mb-2 p-0'>Email: {teacher.email !== '' ? <b>{teacher.email}</b> : <b className='text-muted'>No tiene email</b>}</p>
                                    <p className='m-0 mb-2 p-0'>Descripción: {teacher.description !== '' ? <b>{teacher.description}</b> : <b className='text-muted'>No tiene descripción</b>}</p>
                                </div>
                            </>
                            :
                            <NoContentToShow icon='mood_bad' messageTitle={'Error...'} messageDes={'Error obteniendo los datos del profesor del curso'} />
                        :
                        <div className="spinner-loading" style={{ marginTop: '8em' }}>
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                }
            </Typography>
        </div >
    )
}
