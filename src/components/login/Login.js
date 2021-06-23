import React, { useState, useEffect, useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './login.scss';
import '../common/alert-message.scss';

// COMPONENTS

// Topografia and textfield
import { Container, Link, TextField, Typography, Button } from '@material-ui/core';

// Alerta
import Alert from '@material-ui/lab/Alert';

// Icons
import { AccountCircleOutlined, Lock, Copyright, Devices, ImportContacts } from '@material-ui/icons'

export default function Login({ history }) {

    // Variables del contexto
    const { signinHandler, changeColor } = useContext(UserContext);

    // Datos del inicio de sesion
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        changeColor('#ffcdd2');

        if (localStorage.getItem('token')) {
            if (localStorage.getItem('user_role') === 'teacher' || localStorage.getItem('user_role') === 'admin') {
                history.push('/course/mycourses');
            } else {
                history.push(`/course/mycourses/${localStorage.getItem('user_name')}`);
            }
        }
    });

    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (message) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(message); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    }

    const signIn = async (e) => {
        e.preventDefault();

        try {
            setProcess(true);
            setProcessMessage('Ingresando...');

            const response = await api.post('/api/auth/signin', { id, password });

            const { user_name, user_last_name, user_id, user_role, user_image, token, expire_at, message } = response.data;

            if (user_id && token) {
                localStorage.setItem('user_name', user_name);
                localStorage.setItem('user_last_name', user_last_name);
                localStorage.setItem('user_id', user_id);
                localStorage.setItem('user_role', user_role);
                localStorage.setItem('user_image', user_image);
                localStorage.setItem('token', token);
                localStorage.setItem('expire_at', expire_at);

                signinHandler();

                setProcess(false);
                setProcessMessage('');

                if (user_role === 'teacher' || user_role === 'admin') {
                    history.push('/course/mycourses');
                } else {
                    history.push(`/course/mycourses/${user_name}`);
                }
            } else {
                setProcess(false);
                setProcessMessage('');
                showError(message);
            }
        } catch (error) {
            if (error.response) {
                showError(error.response.data.message);
            } else {
                showError('Error al intentar hacer login');
            }
            setProcess(false);
            setProcessMessage('');
        }
    }

    return (
        <div className="background-login">
            <div className="background-overlay">
                {error ?
                    <Alert className="alert-message" severity="error">{errorMessage}</Alert>
                    : ""
                }
                {process ?
                    <Alert className="alert-message" severity="info">{processMessage}</Alert>
                    : ""
                }
                <header className="header-login">
                    <Container className="d-flex">
                        <Typography variant="h5" className="mr-auto">App</Typography>
                        <Typography variant="h6">Login</Typography>
                    </Container>
                </header>
                <div className="login-card shadow row">
                    <div className="col-md-6 p-0">
                        <div className="login-image">
                        </div>
                    </div>
                    <div className="col-md-6 px-3 pt-2 pb-4">
                        <div className="signin-side">
                            <Typography variant="h6">
                                Sign in
                            </Typography>
                            <hr className="mx-4" />
                            <Container>
                                <form onSubmit={evt => signIn(evt)}>
                                    <Typography>
                                        <div className="form-group my-4 d-flex align-items-center">
                                            <AccountCircleOutlined className="align-self-end mr-2" />
                                            <TextField color="secondary" className="form-control" type="number" onChange={evt => setId(evt.target.value)} value={id} label="Numero de identificación" name="id" required />
                                        </div>
                                        <div className="form-group my-4 d-flex align-items-center">
                                            <Lock className="align-self-end mr-2" />
                                            <TextField color="secondary" className="form-control" type="password" minLength="4" onChange={evt => setPassword(evt.target.value)} value={password} label="Contraseña" name="contrasena" required />
                                        </div>
                                        <div className="form-group d-flex justify-content-center">
                                            <Button type="submit" variant="outlined" color="secondary" className="btn btn-primary">Sign in</Button>
                                        </div>
                                    </Typography>
                                </form>
                            </Container>
                            <Link color="secondary" className="" to="/course/mycourses">¿Olvidó la contraseña?</Link>
                        </div>
                    </div>
                </div>
                <footer className="footer-login">
                    <Typography variant="subtitle1" component="h1" className="">
                        Copyright <Copyright />
                    </Typography>
                    <div></div>
                    <Typography variant="subtitle1" component="h1" className="">
                        Uniquindio <ImportContacts />
                    </Typography>
                    <div></div>
                    <Typography variant="subtitle1" component="h1" className="">
                        Wil/Cris <Devices />
                    </Typography>
                </footer>
            </div>
        </div>
    )
}
