import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';

//image-exists
import imageExists from 'image-exists';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './course.scss';

import { prominent, average } from 'color.js'

// COMPONENTES

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Material UI Core
import { Breadcrumbs, List, ListItemIcon, ListItem, ListItemText, Typography, Tooltip, Divider, Container } from '@material-ui/core';

// Icons
import { SendSharp } from '@material-ui/icons';

// Course Information (Teacher view)
import CourseInformationTeacher from './teacher-view/CourseInformation';
import StudentsInformation from './teacher-view/StudentsInformation';
import UnitsInformationTeacher from './teacher-view/UnitsInformation';

// Course information (Student View)
import CourseInformationStudent from './student-view/CourseInformation';
import ClassmatesInformation from './student-view/ClassmatesInformation';
import UnitsInformationStudent from './student-view/UnitsInformation';

// Link
import { Link } from 'react-router-dom';

export default function CourseView({ history }) {

    // Datos del contexto de usuario
    const { isAdmin, isTeacher, changeColor, changeFontColor } = useContext(UserContext);

    // Datos que vienen como parametros en la ruta para este componente
    const { type, id, view } = useParams();

    // Curso que se obtiene de la id que llega por parametro de la ruta
    const [course, setCourse] = useState(null);

    // Colors for the navbar in base of the image of the course
    const [color, setColor] = useState(null);

    const [currentView, setCurrentView] = useState(0);

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        if (course) {
            if (color) {

                changeColor(`rgba(${color[0] + 100}, ${color[1] + 100}, ${color[2] + 100})`);
            }
        }
    }, [color]);

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

        if (course) {
            imageExists(`${process.env.REACT_APP_API_URL}/course-images/${course.image}`, (exists) => {
                if (exists) {
                    average(`${process.env.REACT_APP_API_URL}/course-images/${course.image}`, { sample: 10 }).then(color => {
                        console.log(color); // [241, 221, 63]
                        setColor(color);
                    })
                }
            });
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

            //En caso de que no se encuentre un curso se redirige a /unauthorized
            if (!course) {
                history.push('/unauthorized');
            }
        }
    }

    // Metodo para redirigir dada una ruta que llega por parametro
    const redirect = (route, view) => {
        setCurrentView(view);
        history.push(route);
    }

    return (
        <div className="course-view">
            {
                course ?
                    <TitleCard
                        title={course.name}
                        color="#B6E768"
                        colorFont='#fff'
                        image={`${process.env.REACT_APP_API_URL}/course-images/${course.image}`}
                    />
                    :
                    ""
            }
            <div className="row p-0 m-0">
                <div className="col-md-3 p-0 m-0">
                    <div className="mt-4 mx-5 mx-md-0">
                        <List
                            component='div'
                            className='list-views'
                            subheader={
                                course ?
                                    <Breadcrumbs className="course-view-breadcrumbs">
                                        <Link className='text-muted' to={isTeacher || isAdmin ? "/course/mycourses" : `/course/mycourses/${localStorage.getItem('user_name')}`}>Mis cursos</Link>
                                        <Tooltip enterDelay={500} enterNextDelay={200} title={course.name} aria-label={`${course.name}`}>
                                            <Typography><b className="text-overflow-2">{course.name}</b></Typography>
                                        </Tooltip>

                                    </Breadcrumbs>
                                    :
                                    ""
                            }
                        >
                            <Typography variant='h1'>
                                <ListItem className='item-view' onClick={() => redirect(`course-info`, 0)} selected={currentView === 0} button>
                                    <ListItemIcon>
                                        <SendSharp />
                                    </ListItemIcon>
                                    <ListItemText primary="Info del curso" />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem className='item-view' onClick={() => redirect(`units-info`, 1)} selected={currentView === 1} button>
                                    <ListItemIcon>
                                        <SendSharp />
                                    </ListItemIcon>
                                    <ListItemText primary="Unidades" />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem className='item-view' onClick={() => redirect(`students-info`, 2)} selected={currentView === 2} button>
                                    <ListItemIcon>
                                        <SendSharp />
                                    </ListItemIcon>
                                    <ListItemText primary={type === "edit" ? "Estudiantes" : "Compañeros"} />
                                </ListItem>
                                {type === "edit" ?
                                    <>
                                        <Divider variant="inset" component="li" />
                                        <ListItem className='item-view' onClick={() => redirect(`progress-info`, 3)} selected={currentView === 3} button>
                                            <ListItemIcon>
                                                <SendSharp />
                                            </ListItemIcon>
                                            <ListItemText primary='Progreso' />
                                        </ListItem>
                                    </>
                                    : ""}
                            </Typography>
                        </List>
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
                                        <UnitsInformationTeacher course={course} setCourse={setCourse} progress={false} />
                                        :
                                        view === "progress-info" ?
                                            <UnitsInformationTeacher course={course} setCourse={setCourse} progress={true} />
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
