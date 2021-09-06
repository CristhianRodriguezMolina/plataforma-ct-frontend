import { useState, useEffect, useContext } from 'react';
import arrayMove from 'array-move';
import api from '../../../services/api';
import { useParams } from "react-router-dom";
import shuffleArray from 'shuffle-array';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

//SCSS
import './LogicSequenceStudent.scss';

// Util methods
import * as util from '../../../util/util';

//COMPONENTS

//Sequence Card
import SequenceCard from './SequenceCard';

//SortableContainer
import { SortableContainer } from 'react-sortable-hoc';

// Title card
import TitleCard from '../../common/TitleCard';

// Alert
import Alert from '@material-ui/lab/Alert';

//Timer
import Timer from '../../common/Timer';
import { InfoOutlined } from '@material-ui/icons';


const SortableList = SortableContainer(({ items }) => {

    return (
        <div>
            {items.map((value, index) => (
                <SequenceCard key={`item-${index}`} forStudents={true} index={index} value={value} />
            ))}
        </div>
    );
});




const LogicSequenceStudent = props => {

    const { courseId, unitId, taskId, activityId } = useParams();

    const { changeColor } = useContext(UserContext);

    const [sequenceList, setSequenceList] = useState(null);
    const [logicSequence, setLogicSequence] = useState(null);
    const [activity, setActivity] = useState(null);

    //Obtiene el progreso del estudiante
    const [studentActivity, setStudentActivity] = useState(null);

    const [orderedSequenceList, setOrderedSequenceList] = useState(null);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [info, setInfo] = useState(false); // Variable flag de informacion
    const [infoMessage, setInfoMessage] = useState(''); // Info message
    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio
    const [feedBack, setFeedBack] = useState(false); //Variable flag de proceso satisfactorio
    const [feedBackMessage, setFeedBackMessage] = useState(''); //Mensaje de proceso satisfactorio

    //Timer vars
    const [isActive, setIsActive] = useState(false);

    //Attempts number
    const [attemptsNumber, setAttemptsNumber] = useState(0);

    useEffect(() => {
        changeColor('#f8bbd0');
    });

    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    };

    // Funcion para mostrar una alerta de error dado un mensaje
    const showInfo = (message) => {
        setInfo(true);   //Se cambia el estado de mensaje de error a verdadero
        setInfoMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setInfo(false);
            setInfoMessage("");
        }, 2000)
    };

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000)
    }

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showFeedBack = (message) => {
        setFeedBack(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setFeedBackMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setFeedBack(false);
            setFeedBackMessage("");
        }, 2000)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setSequenceList(arrayCopy);
    };

    useEffect(() => {
        if (props.activity && props.inheritedActivity && props.studentActivity) {

            if (props.studentActivity.complete) {
                setSequenceList(props.studentActivity.answer);
            }
            else {
                setSequenceList(shuffleArray(props.inheritedActivity.sequence_cards, { 'copy': true }));
            }
            setLogicSequence(props.inheritedActivity);
            setOrderedSequenceList(props.inheritedActivity.sequence_cards);
            setActivity(props.activity);
            setStudentActivity(props.studentActivity);
            setIsActive(true);
        }
    }, [props.activity, props.inheritedActivity, props.studentActivity]);

    const handleCompleteActivity = (minutes, seconds) => {

        if (studentActivity) {
            api.put(`/api/student-activity/${studentActivity._id}`, {
                complete: true,
                grade: 5,
                minutes,
                seconds,
                answer: sequenceList,
                type: activity.type,
                attempts: attemptsNumber
            }, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
                .then((res) => {
                    showSuccess(`Actividad realizada, su calificación es: ${res.data.updatedStudentActivity.grade}`)
                    setStudentActivity(res.data.updatedStudentActivity);

                })
                .catch((err) => {
                    if (err.response) {
                        showError(err.response.data.message);
                    }
                    else {
                        showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
                    }
                });
        }
    };

    const checkAnswer = () => {

        setAttemptsNumber(attemptsNumber + 1);
        let equals = true;

        for (let i = 0; i < orderedSequenceList.length && equals; i++) {
            if (sequenceList[i]._id !== orderedSequenceList[i]._id) {
                equals = false
            }
        }

        if (equals) {
            setIsActive(false);
        }
        else {
            showFeedBack('Tu respuesta aun tiene algunos errores ¡Sigue intentando!');
        }
    };

    const nameInputStyle = {
        textAlign: "center",
        width: "80%",
        fontSize: "1.7em",
        margin: "0.5em auto 0 auto",
        padding: "0.4em",
        lineHeight: "1.2em",
        fontWeight: "600"
    };

    const desInputStyle = {
        width: "100%",
        fontSize: "1em",
        margin: "0.5em auto 0 auto",
        padding: "0.7em",
        overflow: "hidden",
        lineHeight: "1.2em",
        fontWeight: "500",
        minHeight: "2.5em"
    };

    return (
        <>
            <TitleCard
                title="Actividad de secuencia lógica"
                color="#FA61CD"
                colorFont="#FFF"
            />

            {error ?
                <Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
                : ""
            }

            {info ?
                <Alert className='alert-message' severity='info' >{infoMessage}</Alert>
                : ""
            }

            {feedBack ?
                <Alert className='alert-message-feedback alert-message' icon={<InfoOutlined style={{ color: 'whitesmoke' }} />} style={{
                    backgroundColor: 'rgb(180, 101, 233)',
                    color: 'whitesmoke',
                    display: 'flex',
                    alignItems: 'center'
                }} severity=""><div>{feedBackMessage}</div></Alert>
                : ""
            }

            {success ?
                <Alert className="alert-message" severity="success">{successMessage}</Alert>
                : ""
            }

            <Timer isActive={isActive} sendTime={(minutes, seconds) => handleCompleteActivity(minutes, seconds)} />

            {logicSequence && studentActivity ?

                <div className="logic-sequence-student-container">
                    <div>
                        <h1 style={nameInputStyle} >{activity.name}</h1>
                        <p style={desInputStyle} >{activity.description.trim() === '' ? 'Aqui iría la descripción... si tan solo tuviera una' : activity.description}</p>
                        <div className='activity-attributes'>
                            <div className="difficulty-grid-item">
                                <p><b>Dificultad:</b> {util.getDifficulty(activity.difficulty)}</p>
                            </div>
                        </div>
                        <hr className="hr-bar"></hr>

                        <div className="panels">
                            {studentActivity.complete ?
                                <p>Tu respuesta:</p>
                                : ""}
                            <div className="sequence-cards-container">
                                {sequenceList ?
                                    <SortableList items={sequenceList} onSortEnd={onSortEnd} /> : ""}
                            </div>
                        </div>
                    </div>

                    <hr className="hr-bar"></hr>

                    {!studentActivity.complete ?
                        <button onClick={checkAnswer} className="custom-btn custom-btn-success px-3 py-1">Aceptar</button> :
                        <button className="custom-btn custom-btn-success px-3 py-1" disabled>Terminada</button>}

                </div>
                : ''}
        </>
    )
};
export default LogicSequenceStudent;
