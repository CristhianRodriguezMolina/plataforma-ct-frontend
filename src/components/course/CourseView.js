import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// API
import api from '../../services/api';

// COMPONENTES

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

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
        <div>
            <TitleCard
                name={course.name}
                color="#B6E768"
            />
            <div>
                <h1>The god damn course view</h1>
            </div>
        </div>
    )
}
