import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

// API
import api from '../../services/api';

// Date formater
import dateFormat from 'dateformat';

// COMPONENTS

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Contenedor
import Container from '@material-ui/core/Container';

// Alert
import Alert from '@material-ui/lab/Alert';

export default function CreateUser({ history }) {

    // Datos que vienen como parametros en la ruta para este componente
    const { type, action, ID } = useParams();

    const [first_name, setFirstName] = useState(''); //Primer nombre del usuario
    const [last_name, setLastName] = useState(''); //Apellido del usuario
    const [birth_date, setBirthDate] = useState(''); //Edad del usuario
    const [genre, setGenre] = useState('Selecciona un genero'); //Genero del usuario
    const [id, setId] = useState(''); //Id del usuario
    const [password, setPassword] = useState(''); //Contraseña del usuario
    const [confirm_password, setConfirmPassword] = useState(''); //Comfirmación de contraseña del usuario

    // Usuario en caso de que se vaya a editar
    const [user, setUser] = useState(null);

    // MENSAJES DEL FORMULARIO
    const [error, setError] = useState(false); //Variable flag de existencia de error
    const [errorMessage, setErrorMessage] = useState(''); //Mensaje de error
    const [process, setProcess] = useState(false); //Variable flag de existencia de un proceso
    const [processMessage, setProcessMessage] = useState(''); //Mensaje de proceso

    useEffect(() => {
        if(ID){ // En caso de que llegue una ID de usuario por la ruta            
            fetchUser();
        }
        if(action !== "create" && action !== "edit"){
            history.push('/');
        }
        if(type !== "teachers" && type !== "students"){
            history.push('/');
        }
    }, [type])

    // Funcion para mostrar una alerta de error dado un mensaje
    const showError = (error) => {
        setError(true);   //Se cambia el estado de mensaje de error a verdadero
        setErrorMessage(error); //Se setea el mensaje de error
        setTimeout(() => { //Dura 2sg en pantalla el mensaje
            setError(false);
            setErrorMessage("");
        }, 2000)
    }

    const getStringDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        
        return `${year}-${month}-${day}`
    }

    // METODO PARA OBTENER LOS DATOS DE UN USUARIO EN DADO CASO DE QUE SE VAYA A EDITAR CON LA ID QUE LLEGA POR LA RUTA
    const fetchUser = async() => {
        try {
            setProcess(true);
            setProcessMessage("Obteniendo datos usuario...");

            const response = await api.get(`/api/person/${ID}`);

            const { user, message } = response.data;

            if(user){
                console.log(getStringDate(user.birth_date))
                setBirthDate(user.birth_date);
                setId(user.id);
                setGenre(user.genre);
                setFirstName(user.first_name);
                setLastName(user.last_name);  

                setUser(user);

                setProcess(false);
                setProcessMessage('');

                console.log(user);
            }else{
                showError(message);
            }
        } catch (error) {
            setProcess(false);
            setProcessMessage('');

            showError('Error inesperado en el servidor');
            console.log(`Ha ocurrido un error: ${error}`);
            history.push('/');
        }
    }

    const createUser = async(e) => {
        e.preventDefault();

        try {
            if(password !== "" && confirm_password !== "" || action==="edit"){
                if (id !== "" && first_name !== "" && last_name !== ""  //Se verifica la existencia de todos los campos del formulario
                 && birth_date !== Date.now && genre !== "") {
    
                    setProcess(true);
                    setProcessMessage("Creando usuario...");
                    
                    //Role seleccionados para el usuario
                    let role = null;
                    if(type==="teachers"){role = "teacher"}else{role = "student"}
    
                    let response = null;
    
                    if(action==="create"){
                        response = await api.post('/api/person', { //Peticion post a la api para crear un usuario nuevo
                            id,                         //
                            password,                   //  PARAMETROS 
                            confirm_password,           //  DE 
                            first_name,                 //  LA PETICION
                            last_name,                  //
                            birth_date,                        //
                            genre,                      //
                            role}); 
                    }else{
                        response = await api.put(`/api/person/${user._id}`, { //Peticion post a la api para crear un usuario nuevo                               
                            id,                         //  PARAMETROS
                            first_name,                 //  DE 
                            last_name,                  //  LA PETICION
                            birth_date,                        //
                            genre,                      //
                            role}); 
                    }
    
                    const { savedUser, updatedUser, message } = response.data;

                    console.log(response.data)
    
                    if (savedUser || updatedUser) { //Se verifica si existe                 
                        setBirthDate(Date.now);
                        setId('');
                        setGenre('');
                        setPassword('');    
                        setConfirmPassword(''); // SE LIMPIAN LOS VALORES DEL FORMULARIO
                        setFirstName('');
                        setLastName('');               
                        
                        history.push(`/user/${type}`);
                    } else {
                        showError(message);
                    }
    
                    setProcess(false);
                    setProcessMessage('');
                } else {
                    showError("Debes llenar todos los campos");
                }
            }else{
                showError("Debes llenar todos los campos");
            }
        } catch (error) {
            setProcess(false);
            setProcessMessage('');

            showError('Error inesperado en el servidor');
            console.log(`Ha ocurrido un error: ${error}`);
        }
    }

    return (
        <div>
            <TitleCard 
                title={type=="teachers"?"Gestión de profesores":"Gestion de alumnos"}
                color={type=="teachers"?"#FFA552":"#3C8AFF"}
            /> 
            <Container className="mt-4" maxWidth="sm">
                <form onSubmit={evt => createUser(evt)} className="form-create-user">
                    <h1 className="h5">{action==="create"?"Crear":"Actualizar"} {type==="teachers"?"profesor":"alumno"}</h1>
                    <hr/>
                    <p className=""><b>Datos personales</b></p>
                    <div className="form-group">
                        <label className="form-label">Nombres</label>
                        <input className="form-control" type="text" onChange={evt => setFirstName(evt.target.value)} value={first_name} label="Nombre" name="nombres" required />
                    </div>
                    <div className="form-group">
                        <label>Apellidos</label>
                        <input className="form-control" type="text" onChange={evt => setLastName(evt.target.value)} value={last_name} label="Apellidos" name="apellidos" required />
                    </div>
                    <div className="form-group">
                        <label>Edad</label> 
                        <input className="form-control" type="date" min="1980-01-01" max={dateFormat(new Date(), 'yyyy-mm-dd')} onChange={evt => setBirthDate(evt.target.value)} value={dateFormat(birth_date, 'yyyy-mm-dd')} label="Fecha de cumpleaños" name="fechadecumpleaños" required />
                    </div>
                    <div className="form-group">
                        <label>Genero</label>
                        <select className="form-control shadow" onChange={evt => setGenre(evt.target.value)} value={genre} aria-label="Default select example" required>
                            <option value="F">Femenino</option>
                            <option value="M">Masculino</option>
                            <option value="NB">No binario</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>ID</label>
                        <input className="form-control" type="number" onChange={evt => setId(evt.target.value)} value={id} label="ID" name="id" required />
                    </div>
                    {
                        action==="create"?                        
                        <>
                            <hr/>
                            <p className=""><b>Datos de sesión</b></p>
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input className="form-control" type="password" minLength="4" onChange={evt => setPassword(evt.target.value)} value={password} label="Contrasena" name="contrasena" required />
                            </div>
                            <div className="form-group">
                                <label>Confirmar contraseña</label>
                                <input className="form-control" type="password" onChange={evt => setConfirmPassword(evt.target.value)} value={confirm_password} label="Confirmar contrasena" name="confirmar_contrasena" required />
                            </div>
                        </>                        
                        :
                            ""

                    }
                    {error?
                        <Alert severity="error">{errorMessage}</Alert>
                        : ""
                    }
                    {process?
                        <Alert severity="info">{processMessage}</Alert>
                        : ""
                    }
                    <div className="form-group d-flex justify-content-center">
                        <button className={type==="teachers"?"btn btn-warning form-control btn-create-user":"btn btn-primary form-control btn-create-user"}>{action==="create"?"Crear":"Actualizar"}</button>
                    </div>
                </form>
            </Container>
        </div>
    )
}
