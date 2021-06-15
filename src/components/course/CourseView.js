import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './course.scss';

// COMPONENTES

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Boton de material UI
import Button from '@material-ui/core/Button';

// Course Information (Teacher view)
import CourseInformationTeacher from './teacher-view/CourseInformation';
import StudentsInformation from './teacher-view/StudentsInformation';
import UnitsInformationTeacher from './teacher-view/UnitsInformation';

// Course information (Student View)
import CourseInformationStudent from './student-view/CourseInformation';
import ClassmatesInformation from './student-view/ClassmatesInformation';
import UnitsInformationStudent from './student-view/UnitsInformation';

// Link
import { Link } from '@material-ui/core';

export default function CourseView({ history }) {

    // Datos del contexto de usuario
    const { isAdmin, isTeacher, changeColor } = useContext(UserContext);

    // Datos que vienen como parametros en la ruta para este componente
    const { type, id, view } = useParams();

    // Curso que se obtiene de la id que llega por parametro de la ruta
    const [course, setCourse] = useState(null);

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        changeColor('#dcedc8');
    });

    useEffect(() => {
        // Para verificar que los datos de la ruta sean nombres correctos
        if (type !== 'edit' && type !== 'view' && view !== 'course-info' && view !== 'students-info' && view !== 'units-info') {
            history.push('/unauthorized');
        }
        // Para verificar que un usuario de role student no pueda acceder a la edición del curso
        else if (type === 'edit' && !isAdmin && !isTeacher) {
            history.push('/unauthorized');
        }
        // Si las verificaciones pasadas fueron aprobadas se busca el curso en cuestion para editar o ver
        else if (!course) {
            fetchData();
        }
    }, [course])

    // Metodo para obtener los datos de un curso en especifico cuya id se especifica en la ruta
    const fetchData = async () => {
        try {
            const response = await api.get(`/api/course/${id}`, { headers: { 'x-access-token': localStorage.getItem('token') } });

            const { course } = response.data;

            if (!course) {
                history.push('/unauthorized');
            }

            setCourse(course);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`)
            if (!course) {
                history.push('/unauthorized');
            }
        }
    }

    // Metodo para redirigir dada una ruta que llega por parametro
    const redirect = (route) => {
        history.push(route);
    }

    return (
        <div className="course-view">
            {
                course ?
                    <TitleCard
                        title={course.name}
                        color="#B6E768"
                    />
                    :
                    ""
            }
            <div className="row p-0 m-0">
                <div className="col-md-3 p-0 m-0">
                    <div className="pt-4 d-flex flex-column justify-content-center align-items-center">
                        <Button onClick={() => redirect(`course-info`)} variant="contained" className="my-3 course-view-botton">Info del curso</Button>
                        <Button onClick={() => redirect(`units-info`)} variant="contained" className="my-3 course-view-botton">Unidades</Button>
                        <Button onClick={() => redirect(`students-info`)} variant="contained" className="my-3 course-view-botton">{type === "edit" ? "Estudiantes" : "Compañeros"}</Button>
                    </div>
                </div>
                <div className="col-md-9 p-0 m-0">
                    {
                        /* Vistas para la edición de un curso por parte de un profesor o admin */
                        type === "edit" && course ?
                            view === "course-info" ?
                                <CourseInformationTeacher course={course} setCourse={setCourse} />
                                :
                                view === "students-info" ?
                                    <StudentsInformation course={course} setCourse={setCourse} />
                                    :
                                    view === "units-info" ?
                                        <UnitsInformationTeacher course={course} setCourse={setCourse} />
                                        :
                                        <Redirect to="/unauthorized" />
                            /* Vistas de un curso para un estudiante */
                            :
                            type === "view" && course ?
                                view === "course-info" ?
                                    <CourseInformationStudent course={course} setCourse={setCourse} />
                                    :
                                    view === "students-info" ?
                                        <ClassmatesInformation course={course} setCourse={setCourse} />
                                        :
                                        view === "units-info" ?
                                            <UnitsInformationStudent course={course} setCourse={setCourse} />
                                            :
                                            <Redirect to="/unauthorized" />
                                :
                                ""
                    }
                </div>
            </div>
        </div>
    )
}
