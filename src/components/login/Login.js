import React, { useState, useEffect, useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// API
import api from '../../services/api';

// SCSS
import './login.scss';
import './alert-message.scss'

// COMPONENTS

// Topografia and textfield
import { Container, Link, TextField, Typography, Button } from '@material-ui/core';

// Alerta
import Alert from '@material-ui/lab/Alert';

// Icons
import { AccountCircleOutlined, Lock } from '@material-ui/icons'

export default function Login({ history }) {

    const { signinHandler, setUser } = useContext(UserContext);

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
        localStorage.setItem('navbar-color', '#ffcdd2')
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

            const { user_name, user_id, user_role, user_image, token, message } = response.data;

            console.log(response)

            if(user_id && token){  
                setUser({
                    token,
                    user_name,
                    user_id,
                    user_role,
                    user_image
                });
                
                signinHandler();

                history.push('/course/mycourses');
            }else {
                showError(message);
            }
        } catch (error) {
            showError(error)
        } finally {
            setProcess(false);
            setProcessMessage('');
        }
    }

    return (
        <div className="background-login">
            <div className="background-overlay">
                {error?
                    <Alert className="alert-message" severity="error">{errorMessage}</Alert>
                    : ""
                }
                {process?
                    <Alert className="alert-message" severity="info">{processMessage}</Alert>
                    : ""
                }
                <div className="login-card shadow row">
                    <div className="col-md-6 p-0">
                        <div className="login-image m-0">
                        </div>                        
                    </div>
                    <div className="col-md-6 px-3 pt-2 pb-4 signin-side">
                        <Typography variant="h6">
                            Sign in
                        </Typography>
                        <hr className="mx-4"/>
                        <Typography>
                            <Container>
                                <form onSubmit={evt => signIn(evt)}>
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
                                </form>
                            </Container>
                        </Typography>
                        <Link color="secondary" className="" to="/course/mycourses">Olvido la contraseña?</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
