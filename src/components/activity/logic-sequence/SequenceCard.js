import React, { useContext, useEffect, useState } from 'react';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

//SCSS
import './SequenceCard.scss';
import '../../common/alert-message.scss';

// to make API calls
import api from '../../../services/api';

// COMPONENTS
import { Itemtypes } from '../../../util/item';
import { LogicSequenceContext } from './LogicSequence';
import { SortableElement } from 'react-sortable-hoc';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import zIndex from '@material-ui/core/styles/zIndex';

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

// Icono Delete
import DeleteIcon from '@material-ui/icons/Delete';

// Modal de confirmación 
import AlertModal from '../../common/AlertModal';

// Alert
import Alert from '@material-ui/lab/Alert';

const SequenceCard = SortableElement(({ value, forStudents }) => {

    const { env } = useContext(UserContext);
    const { setSequenceList, logicSequence, setSelectedCard, setCardDeleted, selectedCard } = useContext(LogicSequenceContext);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [info, setInfo] = useState(true); //Variable flag de existencia de un proceso
    const [infoMessage, setInfoMessage] = useState(''); //Mensaje de proceso
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio

    // Variable de estado para el modal
    const [open, setOpen] = useState(false);

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

    const handleClick = () => {
        if (!forStudents) {
            setSelectedCard(value._id);
        }
    };

    const deleteCard = () => {
        api.delete(`/api/logic-sequence/sequence-card/${logicSequence._id}/${value._id}`, {
            headers: { 'x-access-token': localStorage.getItem('token') }
        })
            .then((res) => {
                showSuccess(res.data.message);
                setSelectedCard(null);
                setSequenceList(res.data.updatedLogicSequence.sequence_cards);
                setCardDeleted(true);

            })
            .catch(err => {
                if (err.response) {
                    showError(err.response.message);
                }
                else {
                    showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");

                }
            })
    }

    return (
        <Tooltip enterDelay={500} enterNextDelay={200} title={value.name} aria-label="delete">
            <div
                onClick={handleClick}
                className={`sequence-card-container ${!forStudents ? (
                    selectedCard === value._id ?
                        'selected-card' : '')
                    : "sequence-card-student"
                    } `} >

                {value.image ?
                    <img className="sequence-card-img" src={`${process.env.REACT_APP_API_URL}/i/${value.image}`} alt="default" /> :
                    <img className="sequence-card-img" src={'/default.png'} alt="default" />
                }

                {success ?
                    <Alert className="alert-message logic-sequence-alert" severity="success">{successMessage}</Alert>
                    : ""
                }

                {error ?
                    <Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
                    : ""
                }
                <div className="text-container">
                    <h1 className={`${forStudents ? "text-student" : ""}`} > {value.name}</h1>
                </div>

                {!forStudents ?
                    <>
                        <div className="manage-buttons-container">
                            <IconButton className="manage-buttons-container-1 m-0 p-0" color="secondary" aria-label="Delete" onClick={() => setOpen(!open)}>
                                <DeleteIcon />
                            </IconButton>
                        </div>

                        <AlertModal
                            type="delete"
                            open={open}
                            handleClose={() => setOpen(!open)}
                            message='¿Esta seguro que quiere eliminar esta tarjeta?'
                            action={deleteCard}
                        />
                    </>
                    : ""}
            </div>
        </Tooltip>
    )
});

export default SequenceCard;
