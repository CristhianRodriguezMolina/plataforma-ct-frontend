import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// API
import api from '../../services/api';

// COMPONENTES

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Boton de material UI
import Button from '@material-ui/core/Button';

// Course Information (Teacher view)
import CourseInformation from './teacher-view/CourseInformation';

export default function CourseView(props, { history }) {

    // Datos que vienen como parametros en la ruta para este componente
    const { type, id } = useParams();

    // Curso que se obtiene de la id que llega por parametro de la ruta
    const [course, setCourse] = useState(null);

    useEffect(() => {
        if(!course){
            fetchData();
            console.log('test')
        }
    }, [course])

    const fetchData = async() => {
        try {
            const response = await api.get(`/api/course/${id}`);

            setCourse(response.data.course);
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`)   
        }
    }

    return (
        <div className="course-view">
            {
                course?
                <TitleCard
                    title={course.name}
                    color="#B6E768"
                />
                :
                ""
            }
            <div className="row w-100">
                <div className="col col-md-3">
                    <div className="pt-4">
                        <Button variant="contained" className="d-block course-view-botton">Info del curso</Button>
                        <Button variant="contained" className="d-block course-view-botton">Unidades</Button>
                        <Button variant="contained" className="d-block course-view-botton">{type==="edit"?"Estudiantes":"Compañeros"}</Button>
                    </div>
                </div>
                <div className="col col-md-9">
                    {
                        type==="edit" && course?
                            <CourseInformation course={course} setCourse={setCourse} />
                            :
                            ""
                    }
                </div>
            </div>
        </div>
    )
}
