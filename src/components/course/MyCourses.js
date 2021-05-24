import React, { useState, useEffect } from 'react'

// API
import api from '../../services/api';

// SCSS
import './course.scss';

// COMPONENTS

// Title card
import TitleCard from '../common/TitleCard';

// Course Card
import CourseCard from './CourseCard';

// Alerta
import Alert from '@material-ui/lab/Alert';

export default function MyCourses({ history }) {

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    // INFO BASE DE UN CURSO
    const [name, setName] = useState('New course');
    const [description, setDescription] = useState('Add a description');

    // Cursos de la base de datos
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        if(!courses){
            const fetch = async()=>{
                await api.get('/api/course')
                    .then((response) => {
                        setCourses(response.data.courses);
                    }).catch((error) => {
                        //Muestra errores durante el proceso
                        console.log("Un error ha ocurrido, por favor intentelo de nuevo mas tarde");
                    });
            };
            fetch();
        }
    }, [courses])

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

    const createCourse = async() => {
        setProcess(true);
        setProcessMessage('The course is creating...');

        const response = await api.post('/api/course', {
            name,
            description,
            topic: '',
            visible: false
        }); 

        const { message } = response.data;

        if(response.data.course){
            setProcess(false);
            setProcessMessage('');

            courses.push(response.data.course)

            showSuccess(message);
        }else if(message){
            showError(message);
        }else{
            showError('Error inesperado en el servidor');
        }
    }

    return (
        <div>
            <TitleCard 
                title="My courses"
                color="#B6E768"
            />
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
            <div className="d-flex justify-content-center">
                <div className="d-flex flex-wrap">
                    {
                        courses?
                        courses.map(course => (
                            <CourseCard
                                image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
                                course={course}
                            />
                        ))
                        : 
                        (
                            <div className="mx-auto">
                                <h2>There is no courses</h2>
                            </div>
                        )
                    }
                </div>
            </div>
            <button className="btn btn-success btn-create-course" onClick={createCourse}>Add course</button>
        </div>
    )
}
