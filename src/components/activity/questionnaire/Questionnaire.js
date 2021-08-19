import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

import { useParams, Redirect } from "react-router-dom";

//API
import api from '../../../services/api';

// CONTEXT
import UserContext from '../../../context/user/UserContext';

//SCSS
import './Questionnaire.scss';
import '../../common/alert-message.scss';

//ArrayMove
import arrayMove from 'array-move';

//COMPONENTS

//QuestionCard
import QuestionCard from './QuestionCard';

//SortableContainer
import { SortableContainer } from 'react-sortable-hoc';

// Title card
import TitleCard from '../../common/TitleCard';

// Alert
import Alert from '@material-ui/lab/Alert';

//DynamicInput
import DynamicInput from '../../common/DynamicInput';

import { FormControlLabel, Switch } from '@material-ui/core';

//ICONS
import AddCircleIcon from '@material-ui/icons/AddCircle';

// Boton de icono
import IconButton from '@material-ui/core/IconButton';

export const QuestionnaireContext = createContext({
	questionnaire: null,
	setQuestionsList: null
});

const SortableList = SortableContainer(({ items }) => {

    return (
        <div>
            {items.map((value, index) => (
                <QuestionCard key={`item-${index}`} forStudents={false} index={index} value={value} />
            ))}
        </div>
    );
});

const Questionnaire = () => {

    const { activityId } = useParams();

	//Store questionnaire data
	const [questionnaire, setQuestionnaire] = useState(null);
	const [questionsList, setQuestionsList] = useState(null);

	const [activityName, setActivityName] = useState("");
	const [activityDescription, setActivityDescription] = useState("");

	//Actvity Difficulty
	const [difficulty, setDifficulty] = useState('beginner');

	const [verified, setVerified] = useState(false);

	const [loading, setLoading] = useState(true);

    const { changeColor } = useContext(UserContext);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso
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

	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	};


	useEffect(() => {

		console.log(questionsList)
	}, [questionsList])

	useEffect(() => {
		const fetch = () => {
			api.get(`/api/questionnaire/${activityId}`, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					console.log(res.data)
					setQuestionnaire(res.data);
					setQuestionsList(res.data.questions);
					setActivityName(res.data.activity_id.name);
					setActivityDescription(res.data.activity_id.description);
					setVerified(res.data.activity_id.verified);
					setDifficulty(res.data.activity_id.difficulty);
					setLoading(false);
				})
				.catch(err => {
					setLoading(false);
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("¡No se han podido cargar las tarjetas, por favor intentelo mas tarde!");
					}
				})
		}

		if (!questionnaire) {
			console.log('1')
			fetch();
		}

	}, [questionnaire]);

	const saveQuestionnaire = () => {
		if (activityName && activityName.trim().localeCompare("") !== 0) {
			api.put(`/api/activity/${activityId}`, {
				activity: {
					name: activityName,
					description: activityDescription,
					verified,
					difficulty
				},
				child: {
					questions: questionsList
				}
			}, {
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then(res => {
					showSuccess(res.data.message);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					}
				});
		}
		else {
			showInfo("El nombre de la actividad es requerido");
		}
	};

	const createCard = () => {
		if (questionnaire) {
			api.post(`/api/questionnaire/question/${questionnaire._id}`, { },{
				headers: { 'x-access-token': localStorage.getItem('token') }
			})
				.then((res) => {
					setQuestionsList(res.data.updatedQuestionnaire.questions);
				})
				.catch(err => {
					if (err.response) {
						showError(err.response.data.message);
					}
					else {
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					}
				})
		}
	};

	const onSortEnd = ({ oldIndex, newIndex }) => {

		let arrayCopy = [...questionsList];
		arrayCopy = arrayMove(arrayCopy, oldIndex, newIndex);
		setQuestionsList(arrayCopy);
	};

	const updateName = (value) => {
		setActivityName(value);
	};

	const updateDes = (value) => {
		setActivityDescription(value);
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
		<QuestionnaireContext.Provider value={{questionnaire, setQuestionsList}}>
            <TitleCard
                title="Cuestionario"
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

			{!loading?
				questionnaire?
					<div className="questionnaire-container">
						<div className='questionnaire-info'>
							<DynamicInput dynamicInputValue={activityName} dynamicInputStyle={nameInputStyle} sendValue={updateName}></DynamicInput>
							<DynamicInput dynamicInputValue={activityDescription} dynamicInputStyle={desInputStyle} sendValue={updateDes}></DynamicInput>
							<div className='activity-attributes'>

								<div className="difficulty-grid-item">
									<label>Dificultad:</label>
									<select className="form-control" style={{width: '10em'}} onChange={evt => { setDifficulty(evt.target.value); }} value={difficulty} aria-label="Activity difficulty" required>
										<option value="beginner" selected>Principiante</option>
										<option value="intermediate">Intermedio</option>
										<option value="advanced">Avanzado</option>
									</select>
								</div>

								<FormControlLabel className="verified-grid-item switcher" label="Verificado" control={
									<Switch
										checked={verified}
										onChange={() => setVerified(!verified)}
										name="visibilty"
										color="primary"
									/>
								} />
							</div>
						</div>

						<div className="questionnaire-body">
							<hr style={{visibility: 'hidden'}}/>
							{questionsList?
								<SortableList distance={1} items={questionsList} onSortEnd={onSortEnd} />
							:""}
							<div className="create-card-button">
								<IconButton color="primary" aria-label="Create" onClick={createCard}>
									<AddCircleIcon style={{ fontSize: 40 }} />
								</IconButton>
							</div>
						</div>
						<hr className="hr-bar"></hr>
						<button className="save-button custom-btn custom-btn-primary" onClick={() => saveQuestionnaire()}>Guardar cambios generales</button>
					</div>
					:
					<Redirect to="/unauthorized" />
			:

				<div className="spinner-loading">
				  	<div className="spinner-border" role="status">
						<span className="sr-only">Loading...</span>
				  	</div>
				</div>
			}
		</QuestionnaireContext.Provider>
	)
};

export default Questionnaire;
