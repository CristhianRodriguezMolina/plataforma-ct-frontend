import { useState, useEffect, useContext } from 'react';
import arrayMove from 'array-move';
import api from '../../../services/api';
import { useParams, Redirect } from "react-router-dom";

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

    const { changeColor } = useContext(UserContext);

    const [sequenceList, setSequenceList] = useState(null);
    const [logicSequence, setLogicSequence] = useState(null);
    const [activity, setActivity] = useState(null);
    const { activityId } = useParams();
    const [loading, setLoading] = useState(true);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error


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

    const onSortEnd = ({ oldIndex, newIndex }) => {

        let arrayCopy = [...sequenceList];
        arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
        setSequenceList(arrayCopy);
    };

    useEffect(() => {
        const fetch = () => {
            api.get(`/api/logic-sequence/${activityId}`, {
                headers: { 'x-access-token': localStorage.getItem('token') }
            })
                .then((res) => {
                    setLogicSequence(res.data);
                    setSequenceList(res.data.sequence_cards);
                    setActivity(res.data.activity_id);
                    setLoading(false);
                })
                .catch(err => {
                    setLoading(false);
                    console.log('err');
                    console.log(err);
                    if (err.response) {
                        showError(err.response.data.message);
                    }
                    else {
                        showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
                    }
                })
        }

        if (!logicSequence) {
            fetch();
        }
    }, [logicSequence]);

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
                        <button className="custom-btn custom-btn-success px-3 py-1">Aceptar</button>

                    </div>
                    :
                    <Redirect to="/unauthorized" />
                : ""}
        </>
    )
};
export default LogicSequenceStudent;