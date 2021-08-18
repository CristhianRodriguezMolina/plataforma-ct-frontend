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

// Materia-ui lab
import { Pagination } from '@material-ui/lab';

// User modal card
import StudentModalCard from "./StudentModalCard";

// Alert
import Alert from "@material-ui/lab/Alert";

// Search user component
import SearchUser from '../../common/SearchUser';

//No content to show
import NoContentToShow from '../../common/NoContentToShow';

export default function StudentsPopup(props) {
	// Props for the modal
	const { course, isOpen, toggle, isAddingStudents, setIsAddingStudents } = props;

	// MENSAJES DEL MODAL
	const [error, setError] = useState(false); //Variable flag de existencia de error
	const [errorMessage, setErrorMessage] = useState(""); //Mensaje de error
	const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
	const [processMessage, setProcessMessage] = useState(""); //Mensaje de proceso
	const [success, setSuccess] = useState(false); //Variable flag de proceso satisfactorio
	const [successMessage, setSuccessMessage] = useState(""); //Mensaje de proceso satisfactorio

	// Variable to see if the info data is loading
	const [isLoading, setIsLoading] = useState(true);

	// List of students that can be added to the course
	const [students, setStudents] = useState(null);

	// Filtered students
	const [filteredStudents, setFilteredStudents] = useState(null);

	// List of student that will be added to the course
	const [studentsToAdd, setStudentsToAdd] = useState([]);

	// Refs of the button that add students
	const btnAddStudents = useRef(null);

	// Variable to manage the current page of the students list
	const [page, setPage] = useState(1);

	// Variable to set the number of pages there ir gonna be
	const [numPages, setNumPages] = useState(1);

	// Max number of students in one page
	const maxStudents = 5;

	useEffect(() => {
		if (!students || isAddingStudents) {
			fetchStudents();
		}
	}, [students, isAddingStudents]);

	// UseEffect to disable or activate the button to add students depending if there is students to add or not 
	useEffect(() => {
		if (btnAddStudents.current) {
			if (studentsToAdd.length > 0) {
				btnAddStudents.current.disabled = false;
			} else {
				btnAddStudents.current.disabled = true;
			}
		}
	}, [studentsToAdd])

	useEffect(() => {
		if (isOpen) {
			setStudentsToAdd([]);
		}
	}, [isOpen]);

	// UseEffect to manage the current number of pages
	useEffect(() => {
		if (filteredStudents) {
			const newNumPages = Math.ceil(filteredStudents.length / maxStudents);

			// The number of pages is according with the number of students that are been shown 
			setNumPages(newNumPages);

			// If the current page is deleted cause a student is deleted then the current page is setted to the last
			if (page > newNumPages) {
				setPage(newNumPages);
			}
		}
	}, [filteredStudents])

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

			const response = await api.get(`/api/course/not-in-course-students/${course._id}`, {
				headers: { "x-access-token": localStorage.getItem("token") },
			});

			const { students, message } = response.data;

			if (students) {
				// Asignacion de los cursos de la base de datos
				setStudents(students);
				setFilteredStudents(students);

				if (students.length > 0) {
					showSuccess(message);
				}
			} else {
				showSuccess('No hay alumnos para agregar');
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
		setIsLoading(false);
	};

	// Metodo para añadir los estudiantes seleccionados por el usuario al curso actual
	const addStudents = async () => {
		try {
			setProcess(true);
			setProcessMessage("Añadiendo estudiantes...");

			const response = await api.post(`/api/course/students/${course._id}`, {
				students: studentsToAdd
			}, {
				headers: { "x-access-token": localStorage.getItem("token") },
			});

			setIsAddingStudents(true); // This flag activate the fetch users in the StudentsInformation view
			const { acceptedStudents, deniedStudents, message } = response.data;

			if (acceptedStudents) {
				fetchStudents();

				showSuccess(`${acceptedStudents.length} estudiantes agregados al curso`);
				showError(`${deniedStudents.length} estudiantes denegados al curso`);
			} else {
				if (deniedStudents) {
					showError(`${deniedStudents.length} estudiantes denegados al curso`);
				} else {
					showError(message);
				}
			}
		} catch (error) {
			if (error.response) {
				console.log(`Un error ha ocurrido en el servidor: ${error}`);
				showError(error.response.data.message);
			} else {
				console.log(`Un error ha ocurrido en el servidor: ${error}`);
				showError(`Un error ha ocurrido en el servidor: ${error}`);
			}
		}
		setIsAddingStudents(false);
		toggle();
		setProcess(false);
		setProcessMessage("");
	};

	// Method to handle the change of the page
	const handleChangePage = (evt, page) => {
		setPage(page);
	}

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
				<ModalHeader toggle={toggle}>Agregue alumnos a su curso</ModalHeader>
				<ModalBody className="students-modal">
					<SearchUser users={students} filteredUsers={filteredStudents} setFilteredUsers={setFilteredStudents} setPage={setPage} />
					{
						!isLoading ?
							<>
								{filteredStudents && filteredStudents.length > 0
									?
									<>
										{
											filteredStudents.slice((page - 1) * maxStudents, ((page - 1) * maxStudents) + maxStudents).map((student) => (
												<div key={student._id} className="d-flex justify-content-start align-items-center">
													<h5 className="mr-3">{students.indexOf(student) + 1}</h5>
													<StudentModalCard
														student={student}
														setStudentsToAdd={setStudentsToAdd}
													/>
												</div>
											))
										}
										{
											filteredStudents.length > maxStudents ?
												<div className='d-flex justify-content-center mt-4'>
													<Pagination count={numPages} onChange={handleChangePage} page={page} color="primary" />
												</div>
												:
												''
										}
									</>
									:
									<>
										<NoContentToShow messageTitle={'Sin alumnos...'} messageDes={'No hay alumnos para mostrar'} />
									</>

								}
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
						className="custom-btn custom-btn-primary p-2"
						onClick={() => addStudents()}
						ref={btnAddStudents}
					>
						Agregar
					</button>
					<button
						className="custom-btn custom-btn-delete p-2"
						onClick={toggle}
					>
						Cancelar
					</button>
				</ModalFooter>
			</Modal>
		</div>
	);
}

StudentsPopup.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	toggle: PropTypes.func.isRequired,
};
