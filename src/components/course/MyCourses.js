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

// Alert
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
    const [name, setName] = useState('Nuevo curso');
    const [description, setDescription] = useState('Añade una descripción para el curso');
    const [topic, setTopic] = useState('Añade un tema para el curso');

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
                        console.log(`Un error ha ocurrido, por favor intentelo de nuevo mas tarde: ${error}`);
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

    // Funcion para redirigin a la pagina de edición de un curso en especifico con la history
    const redirect = course => {
        history.push(`/course/edit/${course._id}`);
    }

    // Funcion para crear un curso dados unos datos basicos
    const createCourse = async() => {
        setProcess(true);
        setProcessMessage('The course is creating...');

        const response = await api.post('/api/course', {
            name,
            description,
            topic,
            visible: false
        }); 

        const { course, message } = response.data;

        if(course){
            setProcess(false);
            setProcessMessage('');

            courses.push(course);

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
                title="Mis cursos"
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
            {   
                courses && courses.length>0 ?
                (
                    <div className="d-flex flex-wrap mx-auto">
                        {
                            courses.map(course => (
                                <CourseCard
                                    key={course._id}
                                    image="https://i.blogs.es/8c3c21/pcbuild2/450_1000.jpg"
                                    course={course}
                                    setCourses={setCourses}
                                    onPress={() => redirect(course)}
                                />
                            ))
                        }
                    </div>
                )                        
                : 
                (
                    <div>
                        <h3 className="there-is-no-courses">Aún no hay cursos</h3>
                    </div>
                )                   
            }
            <button className="btn btn-success btn-create-course" onClick={createCourse}>Crear curso</button>
        </div>
    )
}
