import { useState, useEffect, useContext } from 'react';
import arrayMove from 'array-move';
import api from '../../../services/api';
import { useParams, Redirect } from "react-router-dom";
import shuffleArray from 'shuffle-array';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

//SCSS
import './LogicSequenceStudent.scss';


//COMPONENTS

//Sequence Card
import SequenceCard from './SequenceCard';

//SortableContainer
import { SortableContainer } from 'react-sortable-hoc';

// Title card
import TitleCard from '../../common/TitleCard';

// Alert
import Alert from '@material-ui/lab/Alert';




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
    const [loading, setLoading] = useState(true);

    //Obtiene el progreso del estudiante
    const [studentActivity, setStudentActivity] = useState(null);

    const [orderedSequenceList, setOrderedSequenceList] = useState(null);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error

    const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
    const [successMessage, setSuccessMessage] = useState(''); //Mensaje de proceso satisfactorio


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

    // Funcion para mostrar una alerta satisfactoria dado un mensaje
    const showSuccess = (message) => {
        setSuccess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
        setSuccessMessage(message); //Se setea el mensaje de proceso satisfactorio
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setSuccess(false);
            setSuccessMessage("");
        }, 2000)
    }

    const onSortEnd = ({ oldIndex, newIndex }) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setSequenceList(arrayCopy);
    };



    useEffect(() => {

        const fetch = async () => {
            try {
                const logicSequenceRes = await api.get(`/api/logic-sequence/${activityId}`, {
                    headers: { 'x-access-token': localStorage.getItem('token') }
                });

                if (!logicSequenceRes) {
                    console.log('logic sequence not found');
                    return;
                }
                setLogicSequence(logicSequenceRes.data);
                setOrderedSequenceList(logicSequenceRes.data.sequence_cards);
                setSequenceList(shuffleArray(logicSequenceRes.data.sequence_cards, { 'copy': true }));
                setActivity(logicSequenceRes.data.activity_id);
                setLoading(false);

                //GET student activity
                const studentActivityRes = await api.post("/api/student-activity/foreign", {
                    student: localStorage.getItem("user_id"),
                    course: courseId,
                    unit: unitId,
                    task: taskId,
                    activity: activityId
                }, {
                    method: 'GET',
                    headers: {
                        'x-access-token': localStorage.getItem('token')
                    }
                });
                if (studentActivityRes.data.studentActivity.length > 0) {

                    setStudentActivity(studentActivityRes.data.studentActivity[0]);

                } else {
                    const createStudentActivityRes = await api.post("/api/student-activity", {
                        studentId: localStorage.getItem("user_id"),
                        courseId: courseId,
                        unitId: unitId,
                        taskId: taskId,
                        activityId: activityId
                    }, {
                        headers: { 'x-access-token': localStorage.getItem('token') }
                    });

                    if (!createStudentActivityRes) {
                        return;
                    }
                    setStudentActivity(createStudentActivityRes.data.savedStudentActivity);
                }

            }
            catch (err) {
                setLoading(false);
                if (err.response) {
                    showError(err.response.data.message);
                }
                else {
                    showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
                }
            }
        };

        if (!logicSequence) {
            fetch();
        }
    }, [logicSequence]);


    const handleCompleteActivity = () => {

        let grade = 0;
        let equals = true;
        for (let i = 0; i < orderedSequenceList.length && equals; i++) {
            if (sequenceList[i]._id !== orderedSequenceList[i]._id) {
                equals = false
            }
        }

        if (equals) {
            grade = 5;
        }

        if (studentActivity) {
            api.put(`/api/student-activity/${studentActivity._id}`, {
                complete: true,
                grade: grade
            }, {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
                .then((res) => {
                    showSuccess(`Actividad realizada, su calificación es: ${res.data.updatedStudentActivity.grade}`)
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
        fontSize: "0.8em",
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
                title="Actividad 1"
                color="#FA61CD"
                colorFont="#FFF"
            />
            {error ?
                <Alert className="alert-message logic-sequence-alert" severity="error">{errorMessage}</Alert>
                : ""
            }
            {success ?
                <Alert className="alert-message" severity="success">{successMessage}</Alert>
                : ""
            }
            {!loading ?
                logicSequence ?
                    <div className="logic-sequence-student-container">
                        <div>
                            <h1 style={nameInputStyle} >{activity.name}</h1>
                            <p style={desInputStyle} >{activity.description}</p>
                        </div>
                        <hr className="hr-bar"></hr>
                        <div className="panels">
                            <div className="sequence-cards-container">
                                {sequenceList ?
                                    <SortableList items={sequenceList} onSortEnd={onSortEnd} /> : ""}
                            </div>

                        </div>
                        <hr className="hr-bar"></hr>
                        <button onClick={handleCompleteActivity} className="custom-btn custom-btn-success px-3 py-1">Aceptar</button>

                    </div>
                    :
                    <Redirect to="/unauthorized" />
                : ""}
        </>
    )
};
export default LogicSequenceStudent;