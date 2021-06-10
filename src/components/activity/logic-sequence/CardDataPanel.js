import React, { useState, useContext, useEffect, useRef } from 'react';

import './CardDataPanel.scss';
import '../../common/alert-message.scss';
import '../../common/DynamicInput';

// to make API calls
import api from '../../../services/api';

import { LogicSequenceContext } from './LogicSequence';

import DynamicInput from '../../common/DynamicInput';
import DropzoneUploader from '../../common/DropzoneUploader';

// Alert
import Alert from '@material-ui/lab/Alert';

const CardDataPanel = props => {

	const { sequenceList, setSequenceList, logicSequence, selectedCard, cardDeleted, setCardDeleted, setSelectedCard } = useContext(LogicSequenceContext);
	const [cardName, setCardName] = useState("");
	const [upload, setUpload] = useState(false);

	const saveButton = useRef(null);

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

	const showInfo = (message) => {
		setProcess(true);   //Se cambia el estado de mensaje de proceso satisfactorio a verdadero
		setProcessMessage(message); //Se setea el mensaje de proceso satisfactorio
		setTimeout(() => { //Dura 2sg en pantalla el mensaje
			setProcess(false);
			setProcessMessage("");
		}, 2000)
	}

	useEffect(() => {
		if (!selectedCard || selectedCard === "") {
			saveButton.current.disabled = true;
		}
		else {
			let tempCard = sequenceList.filter((card, i) => card._id === selectedCard)[0];
			if (tempCard) {
				setCardName(tempCard.name)
				saveButton.current.disabled = false;
			}
		}

	}, [selectedCard]);

	useEffect(() => {
		if (cardDeleted) {
			let tempCard = sequenceList.filter((card, i) => card._id === selectedCard)[0];
			if (tempCard) {
				setCardName(tempCard.name);
				saveButton.current.disabled = false;
			}
			else {
				let length = sequenceList.length;
				if (length > 0) {
					setCardName(sequenceList[length - 1].name);
					setSelectedCard(sequenceList[length - 1]._id);
					saveButton.current.disabled = false;
				}
				else {
					setCardName("");
					setSelectedCard("");
					saveButton.current.disabled = true;
				}

			}
			setCardDeleted(false);
		}
	}, [cardDeleted]);

	useEffect(() => {
		if (upload) {
			setUpload(false);
		}
	}, [upload]);

	const buttonHandler = () => {
		setUpload(true);
	};

	const saveCardInfo = (files) => {
		if (cardName && cardName.trim().localeCompare("") !== 0) {
			if (files.length > 0) {
				const formData = new FormData(); //Crea un formulario
				formData.append('image', files[0]); //Añade un nombre al formulario
				formData.append('name', cardName);
				const config = {
					headers: {
						'content-type': 'multipart/form-data', //Para aceptar archivos binarios
						'content-type': 'application/json',
						'x-access-token': localStorage.getItem('token')
					}
				};
				//Make api call to upload image
				api.post(`/api/data/upload-img/${logicSequence._id}/${selectedCard}`, formData, config)
					.then((response) => {
						setSequenceList(response.data.updatedLogicSequence.sequence_cards);

					}).catch((error) => {
						//Muestra errores durante el proceso
						showError("Ha ocurrido un error inexperado, por favor intentelo mas tarde");
					});
			}
			else {
				api.put(`/api/logic-sequence/sequence-card/${logicSequence._id}/${selectedCard}`, {
					name: cardName
				}, {
					headers: { 'x-access-token': localStorage.getItem('token') }
				})
					.then((res) => {
						showSuccess(res.data.message)
						setSequenceList(res.data.updatedLogicSequence.sequence_cards);
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
		}
		else {
			showInfo("El nombre de la tarjeta es requerido");
		}
	}

	const inputStyle = {
		fontSize: "0.8em",
		margin: "0.5em auto 0 auto",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em",
		paddingLeft: 0
	}

	return (
		<div className="card-data-panel-container">
			<div className="sticky-panel">
				{success ?
					<Alert className="alert-message" severity="success">{successMessage}</Alert>
					: ""
				}
				{error ?
					<Alert className="alert-message" severity="error">{errorMessage}</Alert>
					: ""
				}
				{process ?
					<Alert className="alert-message" severity="info">{processMessage}</Alert>
					: ""
				}

				<h1>Panel de los datos de la tarjeta</h1>
				<p>En este panel de datos puedes cambiar los datos de la tajeta de secuencia que tienes seleccionada</p>
				<h2>Frase <span style={{ color: "red" }}>*</span></h2>
				<DynamicInput dynamicInputValue={cardName} dynamicInputStyle={inputStyle} sendValue={(val) => setCardName(val)}></DynamicInput>
				{/* <input className="form-control" value={cardName} onChange={evt => setCardName(evt.target.value)}></input> */}
				<h2>Imagen <span style={{ color: "rgb(129, 129, 129)" }}>(Opcional)</span></h2>
				<DropzoneUploader
					onFormSubmit={saveCardInfo}
					upload={upload}
					type="image/jpeg, image/png, image/gif"
					maxFiles="1" />
				<button ref={saveButton} className="btn btn-primary" onClick={buttonHandler}>Guardar</button>
			</div>
		</div>
	)
}

export default CardDataPanel;
