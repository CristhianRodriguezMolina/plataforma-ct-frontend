import React, { useEffect, useRef, useState } from "react";

// API
import api from "../../../services/api";

// SCSS
import "./teacherview.scss";

// Props types
import PropTypes from "prop-types";

// COMPONENTS

// Modal components
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

// User modal card
import ActivityModalCard from "./ActivityModalCard";

// Alert
import Alert from "@material-ui/lab/Alert";

//Search Activity
import SearchActivity from '../../common/SearchActivity';

//No Content to show
import NoContentToShow from '../../common/NoContentToShow';

export default function ActivitiesPopup(props) {
    // Props for the modal
    const { task, unitId, isOpen, toggle, isAddingActivities, setIsAddingActivities } = props;

    // MENSAJES DEL MODAL
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(""); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(""); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(""); //Mensaje de proceso satisfactorio

    // Variable to see if the info data is loading
    const [isLoading, setIsLoading] = useState(true);

    // List of activities that can be added to the task
    const [activities, setActivities] = useState(null);

    // Refs of the button that add activities
    const btnAddActivities = useRef(null);

    // List of activities that will be added to the task
    const [activitiesToAdd, setActivitiesToAdd] = useState([]);

    //Filtered Activities
    const [filteredActivities, setFilteredActivities] = useState(activities);

    useEffect(() => {
        if (!activities || isAddingActivities) {
            fetchActivities();
        }
    }, [activities, isAddingActivities]);

    // UseEffect to disable or activate the button to add activities depending if there is activities to add or not 
    useEffect(() => {
        if (btnAddActivities.current) {
            if (activitiesToAdd.length > 0) {
                btnAddActivities.current.disabled = false;
            } else {
                btnAddActivities.current.disabled = true;
            }
        }
    }, [activitiesToAdd])

    useEffect(() => {
        if (isOpen) {
            setActivitiesToAdd([]);

        }
    }, [isOpen]);

    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true); //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => {
            //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000);
    };

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true); //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => {
            //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000);
    };

    // Metodo para obtener los estudiantes de la plataforma
    const fetchActivities = async () => {
        try {
            setProcess(true);
            setProcessMessage("Obteniendo actividades...");

            const response = await api.get(`/api/course/not-in-task-activities/${task._id}`, {
                headers: { "x-access-token": localStorage.getItem("token") },
            });

            const { activities, message } = response.data;


            if (activities) {
                // Asignacion de los cursos de la base de datos
                setActivities(activities);
                setFilteredActivities(activities);

                if (activities.length > 0) {
                    showSuccess(message);
                }
            } else {
                showSuccess('No hay actividades para agregar');
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError(`Un error ha ocurrido obteniendo los estudiantes`);
            }
        }
        setProcess(false);
        setProcessMessage("");
        setIsLoading(false);
    };

    // Metodo para añadir los estudiantes seleccionados por el usuario al curso actual
    const addActivities = async () => {
        try {
            btnAddActivities.current.disabled = true; // This is to avoid add multiple times the same activities

            setProcess(true);
            setProcessMessage("Añadiendo actividades...");

            const response = await api.post(`/api/course/task/activity/${unitId}/${task._id}`, {
                activities: activitiesToAdd
            }, {
                headers: { "x-access-token": localStorage.getItem("token") },
            });

            setIsAddingActivities(true); // This flag activate the fetch users in the StudentsInformation view
            const { acceptedActivities, deniedActivities, message } = response.data;

            setProcess(false);
            setProcessMessage("");
            if (acceptedActivities) {
                fetchActivities();

                showSuccess(`${acceptedActivities.length} actividades agregadas a la tarea`);
                showError(`${deniedActivities.length} actividades denegadas a la tarea`);
            } else {
                if (deniedActivities) {
                    showError(`${deniedActivities.length} actividades denegadas a la tarea`);
                } else {
                    showError(message);
                }
            }
        } catch (error) {
            setProcess(false);
            setProcessMessage("");
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError(`Un error ha ocurrido en el servidor`);
            }
        }
        setIsAddingActivities(false);
        toggle();
        btnAddActivities.current.disabled = false;
    };

    return (
        <div>
            {success ? <Alert className="alert-message mb-5" severity="success">{successMessage}</Alert> : ""}
            {error ? <Alert className="alert-message" severity="error">{errorMessage}</Alert> : ""}
            {process ? <Alert className="alert-message" severity="info">{processMessage}</Alert> : ""}

            <Modal
                isOpen={isOpen}
                toggle={toggle}
                className=""
                size="lg"
                scrollable={true}
                centered={true}
            >
                <ModalHeader toggle={toggle}>Agregue actividades a una tarea</ModalHeader>
                <ModalBody className="students-modal">

                    <SearchActivity activities={activities} filteredActivities={filteredActivities} setFilteredActivities={setFilteredActivities} />
                    {
                        !isLoading ?
                            filteredActivities && filteredActivities.length > 0
                                ? filteredActivities.map((activity, index) => (
                                    <div key={activity._id} className="d-flex justify-content-start align-items-center">
                                        <h5 className="mr-3">{index + 1}</h5>
                                        <ActivityModalCard
                                            activity={activity}
                                            setActivitiesToAdd={setActivitiesToAdd}
                                        />
                                    </div>
                                ))
                                :
                                <>
                                    <NoContentToShow icon='face' messageTitle={'Sin activitidades...'} messageDes={'Ya estan todos las actividades agregadas a la tarea o aún no hay actividades verficadas en la plataforma'} />
                                </>
                            :
                            <div className="spinner-loading" style={{ marginTop: '8em' }}>
                                <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                    }
                </ModalBody>

                <ModalFooter>
                    <button
                        className='custom-btn custom-btn-success p-2'
                        onClick={() => addActivities()}
                        ref={btnAddActivities}
                    >
                        Agregar
                    </button>
                    <div></div>
                    <button
                        className='custom-btn custom-btn-primary p-2'
                        onClick={toggle}
                    >
                        Cancelar
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

ActivitiesPopup.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
};
