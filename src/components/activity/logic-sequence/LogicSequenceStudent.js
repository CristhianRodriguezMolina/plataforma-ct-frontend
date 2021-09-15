import { useState, useEffect, useContext, useRef } from 'react';
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

// Iconos
import { Cancel, CheckCircle } from '@material-ui/icons';

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
    const [feedBack, setFeedBack] = useState(false); //Variable flag de feedback
    const [feedBackMessage, setFeedBackMessage] = useState(''); //Mensaje de feedback

    //Timer vars
    const [seconds, setSeconds] = useState('00');
    const [minutes, setMinutes] = useState('00');
    const [isActive, setIsActive] = useState(false);
    const [counter, setCounter] = useState(0);

    //Attempts number
    const [attemptsNumber, setAttemptsNumber] = useState(0);

    //To prevent api calls in the same time disabling the button
    const acceptButton = useRef(null);

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

    // Funcion para mostrar una alerta de feedback dado un mensaje
    const showFeedBack = (message) => {
        setFeedBack(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setFeedBackMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setFeedBack(false);
            setFeedBackMessage("");
        }, 3000)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setSequenceList(arrayCopy);
    };

    useEffect(() => {
        if (props.activity && props.inheritedActivity && props.studentActivity) {
            if (props.studentActivity.answer.length === props.inheritedActivity.sequence_cards.length) {
                setSequenceList(props.studentActivity.answer);
                setCounter((parseInt(props.studentActivity.minutes) * 60) + parseInt(props.studentActivity.seconds));
                setAttemptsNumber(props.studentActivity.attempts);
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

    //handle the timer
    useEffect(() => {
        let intervalId;

        if (isActive) {
            intervalId = setInterval(() => {
                const secondsCounter = counter % 60;
                const minutesCounter = Math.floor(counter / 60);

                const computedSeconds = String(secondsCounter).length === 1 ? `0${secondsCounter}` : secondsCounter;
                const computedMinutes = String(minutesCounter).length === 1 ? `0${minutesCounter}` : minutesCounter;

                setSeconds(computedSeconds);
                setMinutes(computedMinutes);

                setCounter(counter => counter + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);

    }, [isActive, counter]);

    const handleCompleteActivity = (complete) => {

        setAttemptsNumber(attemptsNumber + 1);
        if (studentActivity) {

            api.put(`/api/student-activity/${studentActivity._id}`, {
                complete,
                grade: 5,
                minutes,
                seconds,
                answer: sequenceList,
                type: activity.type,
                attempts: (attemptsNumber + 1)
            }, {

                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
                .then((res) => {
                    if (complete) {
                        showSuccess('¡Actividad realizada!');
                    }

                    setStudentActivity(res.data.updatedStudentActivity);
                    if (acceptButton.current) {
                        acceptButton.current.disabled = false;
                    }
                })
                .catch((err) => {
                    if (err.response) {
                        showError(err.response.data.message);
                    }
                    else {
                        showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
                    }

                    if (acceptButton.current) {
                        acceptButton.current.disabled = false;
                    }
                });
        }
    };

    const checkAnswer = () => {

        if (acceptButton.current) {
            acceptButton.current.disabled = true;
        }

        let equals = true;

        for (let i = 0; i < orderedSequenceList.length && equals; i++) {
            if (sequenceList[i]._id !== orderedSequenceList[i]._id) {
                equals = false
            }
        }

        if (equals) {
            setIsActive(false);
            handleCompleteActivity(true);
        }
        else {
            handleCompleteActivity(false);
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
                            {
								props.forStudents ?
									studentActivity.complete ?
									<p>Tu respuesta:</p>
									: ""
								: <p>Respuesta del estudiante:</p>
							}
                            <div className="sequence-cards-container">
                                {sequenceList ?
                                    <SortableList items={sequenceList} onSortEnd={onSortEnd} /> : ""}
                            </div>
                        </div>
                    </div>

                    <hr className="hr-bar"></hr>
						
                    {
						props.forStudents ?
							!studentActivity.complete ?
							<button ref={acceptButton} onClick={checkAnswer} className="custom-btn custom-btn-success px-3 py-1">Aceptar</button> :
							<button className="custom-btn custom-btn-success px-3 py-1" disabled>Terminada</button>
						: <div>
							{
								studentActivity.complete ?
									<p className="d-flex justify-content-center aling-items-center"><CheckCircle style={{ color: "green", marginRight: "0.3em" }}/>Completada</p> :
									<p className="d-flex justify-content-center aling-items-center"><Cancel style={{ color: "red", marginRight: "0.3em" }}/>Sin completar</p>
							}
						</div>
					}

                </div>
                : ''}
        </>
    )
};
export default LogicSequenceStudent;
