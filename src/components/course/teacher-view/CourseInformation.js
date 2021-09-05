import React, { useRef, useState } from 'react';

// API
import api from '../../../services/api';

// SCSS
import './teacherview.scss';

// COMPONENTS

// Alerta
import Alert from '@material-ui/lab/Alert';

// Dropzone
import DropzoneUploader from '../../common/DropzoneUploader';

/* TEACHER */
export default function CourseInformation({ course, setCourse }) {

    // Data del curso para realizar cambios
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [topic, setTopic] = useState(course.topic);

    // MENSAJES DE LA VISTA
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [info, setInfo] = useState(false); //Variable flag de existencia de un proceso
    const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    // Bool to active the upload image method
    const [upload, setUpload] = useState(false);

    const saveCourseImage = useRef(null);

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

    // Funcion para mostrar una alerta de info dado un mensaje
    const showInfo = (message) => {
        setInfo(true);   //Se cambia el estado de mensaje de proceso a verdadero
        setInfoMessage(message); //Se setea el mensaje de proceso 
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setInfo(false);
            setInfoMessage("");
        }, 2000)
    }

    // Funcion para actualizar los datos basicos de un curso como Nombre, Descripcion y Tema
    const updateChanges = async (e) => {
        e.preventDefault();

        try {
            setInfo(true);
            setInfoMessage('El curso se esta actualizando...');

            const response = await api.put(`/api/course/${course._id}`, {
                name,
                description,
                topic
            }, { headers: { 'x-access-token': localStorage.getItem('token') } });

            const { updatedCourse, message } = response.data;

            if (updatedCourse) {
                setCourse(prevState => {
                    return { ...prevState, ...{ name, description, topic } }
                });

                showSuccess(message);
            } else {
                showError(message);
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError('Error inesperado en el servidor');
            }
        }
        setInfo(false);
        setInfoMessage('');
    }

    const handleUpload = () => {
        setUpload(!upload);
    }

    const uploadImage = async (files) => {
        try {
            if (files.length > 0) {
                saveCourseImage.current.disabled = true; // This is for avoid problems if the user press the button multiple times

                setInfo(true);
                setInfoMessage('Subiendo imagen del curso al servidor...');

                const form = new FormData()
                form.append('folder', 'course-images');
                form.append('image', files[0]);

                const config = {
                    headers: {
                        'content-type': 'multipart/form-data', //Para aceptar archivos binarios
                        'content-type': 'application/json',
                        'x-access-token': localStorage.getItem('token')
                    }
                }

                const response = await api.post(`api/data/upload-img-course/${course._id}`, form, config);

                const { updatedCourse, message } = response.data;

                if (updatedCourse) {
                    setCourse(prevValues => { return { ...prevValues, image: updatedCourse.image } });

                    showSuccess(message);
                }

                saveCourseImage.current.disabled = false;
            } else {
                showInfo('Selecciona alguna imagen para agregar al curso')
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError('Error en el servidor');
            }
            saveCourseImage.current.disabled = false;
        }
        setUpload(!upload);
        setInfo(false);
        setInfoMessage('');
    }

    return (
        <div className="course-information container pt-4 px-3 px-md-5">
            {success ?
                <Alert className='alert-message' severity="success">{successMessage}</Alert>
                : ""
            }
            {error ?
                <Alert className='alert-message' severity="error">{errorMessage}</Alert>
                : ""
            }
            {info ?
                <Alert className='alert-message' severity="info">{infoMessage}</Alert>
                : ""
            }
            <h1 className="h4">Editar Información del Curso</h1>
            <form className='mb-5' onSubmit={updateChanges}>
                <div className="form-group">
                    <div>
                        <label className="form-label">Nombre del Curso</label>
                        <input type="text" className="form-control" onChange={evt => setName(evt.target.value)} value={name} />
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label className="form-label">Descripción de Curso</label>
                        <textarea className="form-control" rows="3" onChange={evt => setDescription(evt.target.value)} value={description} />
                    </div>
                </div>
                <div className="form-group">
                    <div>
                        <label className="form-label">Tema del Curso</label>
                        <input type="text" className="form-control" onChange={evt => setTopic(evt.target.value)} value={topic} />
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="custom-btn custom-btn-info px-2 py-2 mt-3">Guardar cambios</button>
                </div>
            </form>
            <div>
                <label className="form-label">Imagen del Curso</label>
                <div className='d-flex justify-content-between align-items-start'>
                    <DropzoneUploader
                        onFormSubmit={uploadImage}
                        upload={upload}
                        type="image/jpeg, image/png, image/gif"
                        maxFiles="1"
                        className='w-50'
                    />
                    {
                        course.image ?
                            course.image !== '' ?
                                <div className='img-wrapper'>
                                    <img src={`${process.env.REACT_APP_API_URL}/course-images/${course.image}`} alt="CourseImage" loading="lazy" />
                                </div>
                                : ""
                            : ""
                    }
                </div>
                <button onClick={handleUpload} ref={saveCourseImage} className="custom-btn custom-btn-info px-2 py-2 mt-3">Subir imagen</button>
            </div>
        </div>
    )
}
