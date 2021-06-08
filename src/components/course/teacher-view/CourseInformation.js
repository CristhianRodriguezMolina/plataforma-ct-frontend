import React, { useState } from 'react';

// API
import api from '../../../services/api';

// SCSS
import './teacherview.scss';

// COMPONENTS

// Alerta
import Alert from '@material-ui/lab/Alert';


/* TEACHER */
export default function CourseInformation({ course, setCourse }) {

    // Data del curso para realizar cambios
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [topic, setTopic] = useState(course.topic);

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

    // Funcion para actualizar los datos basicos de un curso como Nombre, Descripcion y Tema
    const updateChanges = async(e) => {
        e.preventDefault();

        try {
            setProcess(true);
            setProcessMessage('El curso se esta actualizando...');

            const response = await api.put(`/api/course/${course._id}`, {
                name,
                description, 
                topic
            }, {headers: {'x-access-token':localStorage.getItem('token')}});

            const { updatedCourse, message } = response.data;

            if(updatedCourse){
                setCourse(prevState => {
                    return { ...prevState, ...{name, description, topic} }
                });

                setProcess(false);
                setProcessMessage('');

                showSuccess(message);
            }else{
                showError(message);
            }            
        } catch (error) {
            setProcess(false);
            setProcessMessage('');
            showError('Error inesperado en el servidor');
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    return (
        <div className="course-information container pt-4 px-5">
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
            <h1 className="h4">Edit Course Information</h1>            
            <form onSubmit={updateChanges}>
                <div className="form-group">
                    <div>
                        <label className="form-label">Course name</label>
                        <input type="text" className="form-control" onChange={evt => setName(evt.target.value)} value={name} />
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label className="form-label">Course description</label>
                        <textarea className="form-control" rows="3" onChange={evt => setDescription(evt.target.value)} value={description}/>
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label className="form-label">Course topic</label>
                        <input type="text" className="form-control" onChange={evt => setTopic(evt.target.value)} value={topic} />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="btn btn-info mt-3">Actualizar cambios</button>
                </div>
            </form>
        </div>
    )
}
