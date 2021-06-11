import React, { useEffect, useState } from "react";

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
import StudentModalCard from "./StudentModalCard";

// Button
import Button from "@material-ui/core/Button";

// Alert
import Alert from "@material-ui/lab/Alert";

export default function StudentsPopup(props) {
	// Props for the modal
	const { course, isOpen, toggle } = props;

	// MENSAJES DEL MODAL
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(""); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(""); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(""); //Mensaje de proceso satisfactorio

	// List of students
	const [students, setStudents] = useState(null);

	// List of student that will be added to the course
	const [studentsToAdd, setStudentsToAdd] = useState([]);

	useEffect(() => {
		if (!students) {
			fetchStudents();
		}
	}, [students]);

	useEffect(() => {
		if (isOpen) {
			setStudentsToAdd([]);
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
	const fetchStudents = async () => {
		try {
			setProcess(true);
			setProcessMessage("Obteniendo estudiantes...");

			const response = await api.get("/api/person/role/student", {
				headers: { "x-access-token": localStorage.getItem("token") },
			});

			const { users, message } = response.data;

			if (users) {
				// Asignacion de los cursos de la base de datos
				setStudents(users);

				console.log(users);

				if (users.length > 0) {
					showSuccess(message);
				}
			} else {
				showError(message);
			}
		} catch (error) {
			if (error.response) {
				console.log(`Un error ha ocurrido obteniendo los estudiantes ${error}`);
				showError(error.response.data.message);
			} else {
				console.log(`Un error ha ocurrido obteniendo los estudiantes ${error}`);
				showError(`Un error ha ocurrido obteniendo los estudiantes ${error}`);
			}
		}
		setProcess(false);
		setProcessMessage("");
	};

	// Metodo para añadir los estudiantes seleccionados por el usuario al curso actual
	const addStudents = async () => {
		try {
			setProcess(true);
			setProcessMessage("Añadiendo estudiantes...");

			const response = await api.post(`/api/course/add-students/${course._id}`, {
				students: studentsToAdd
			}, {
				headers: { "x-access-token": localStorage.getItem("token") },
			});

			const { acceptedStudents, deniedStudents, message } = response.data;

			if (acceptedStudents) {
				showSuccess(`${acceptedStudents.length} estudiantes agregados al curso`)
				showError(`${deniedStudents.length} estudiantes denegados al curso`)
			} else {
				showError(`${deniedStudents.length} estudiantes denegados al curso`)
				showError(message)
			}
		} catch (error) {
			if (error.response) {
				console.log(`Un error ha ocurrido en el servidor: ${error}`);
				showError(error.response.message);
			} else {
				console.log(`Un error ha ocurrido en el servidor: ${error}`);
				showError(`Un error ha ocurrido en el servidor: ${error}`);
			}
		}
		setProcess(false);
		setProcessMessage("");
	};

	return (
		<div>
			{success ? <Alert className="alert-message mb-5" severity="success">{successMessage}</Alert> : ""}
			{error ? <Alert className="alert-message" severity="error">{errorMessage}</Alert> : ""}
			<Modal
				isOpen={isOpen}
				toggle={toggle}
				className=""
				size="lg"
				scrollable="true"
				centered="true"
			>
				<ModalHeader toggle={toggle}>Agregue alumnos a su curso</ModalHeader>
				<ModalBody className="students-modal">

					{process ? <Alert severity="info">{processMessage}</Alert> : ""}
					<form className="search-form d-flex justify-content-between mt-4 ml-4 mb-3">
						<div className="text-field form-group mr-3">
							<input className="form-control text-center" />
						</div>
						<div className="form-group">
							<button type="submit" className="btn-search btn btn-primary">
								Buscar
							</button>
						</div>
					</form>
					{students
						? students.map((student) => (
							<div className="d-flex justify-content-start align-items-center">
								<h5 className="mr-3">{students.indexOf(student) + 1}</h5>
								<StudentModalCard
									student={student}
									setStudentsToAdd={setStudentsToAdd}
								/>
							</div>
						))
						: ""}
				</ModalBody>
				<ModalFooter>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => addStudents()}
					>
						Agregar
					</Button>
					<div></div>
					<Button variant="outlined" color="secondary" onClick={toggle}>
						Cancelar
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

StudentsPopup.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
};
