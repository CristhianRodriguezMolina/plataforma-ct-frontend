import React, { useEffect, useState } from 'react'

// API
import api from '../../../services/api';

// SCSS
import './studentview.scss';

// COMPONENTS

// Material UI components
import { Container, Typography, Avatar } from '@material-ui/core';

/* STUDENT */
export default function CourseInformation(props) {

    // Parametros del componente
    const { course } = props;

    const [teacher, setTeacher] = useState(null);

    useEffect(() => {
        if (!teacher) {
            fetchTeacher();
        }
    }, [teacher])

    const fetchTeacher = async () => {
        try {
            const response = await api.get(`/api/course/teacher/${course.creator}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

            const { message, teacher } = response.data;

            if (teacher) {
                console.log(message);
                setTeacher(teacher);
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.message);
            } else {
                console.log(`Ha ocurrido un error: ${error}`);
            }
        }
    }

    return (
        <div className='course-information container pt-4 px-5'>
            <h1 className="h4">Información General del Curso</h1>
            <hr />
            <Typography variant="subtitle1">
                <p className='my-4'>{course.description}</p>
            </Typography>
            <hr />
            <h1 className="h5 text-center">Profesor del curso</h1>
            <Typography variant="subtitle1">
                {
                    teacher ?
                        <>
                            <div className="d-flex">
                                <Avatar className="course-info-avatar" src="https://picsum.photos/200/300" />
                                <div>
                                    <p className='m-0 ml-4 mb-2 p-0'><b>{teacher.first_name} {teacher.last_name}</b></p>
                                    <p className='m-0 ml-4 mb-2 p-0 text-muted'>Identificación: {teacher.id !== '' ? <b>{teacher.id}</b> : <b>No tiene Identificación :(</b>}</p>
                                    <p className='m-0 ml-4 mb-2 p-0 text-muted'>Genero: {teacher.genre !== 'M' ? <b>Masculino</b> : <b>Femenino</b>}</p>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <p className='m-0 mb-2 p-0'>Telefono: {teacher.phone !== '' ? <b>{teacher.phone}</b> : <b className='text-muted'>No tiene telefono :(</b>}</p>
                                <p className='m-0 mb-2 p-0'>Email: {teacher.email !== '' ? <b>{teacher.email}</b> : <b className='text-muted'>No tiene email :(</b>}</p>
                                <p className='m-0 mb-2 p-0'>Logros: {teacher.achievements !== '' ? <b>{teacher.achievements}</b> : <b className='text-muted'>No tiene logros :(</b>}</p>
                            </div>
                        </>
                        :
                        <>Obteniendo datos del profesor</>
                }
            </Typography>
        </div >
    )
}
