import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// SCSS
import './user.scss';

// COMPONENTS

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Lista de usuarios
import UserList from './UserList';

// Container
import Container from '@material-ui/core/Container';

export default function UserManage({ history }) {

    // Datos que vienen como parametros en la ruta para este componente
    const { type } = useParams();

    // Actual location
    let location = useLocation();

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        if (type === "teachers") {
            localStorage.setItem('navbar-color', '#ffe0b2')
        } else if (type === "students") {
            localStorage.setItem('navbar-color', '#bbdefb')
        }
    }, [type]);

    useEffect(() => {
        if (type !== "teachers" && type !== "students") {
            history.push('/')
        }
    }, [type])

    const redirectCreate = () => {
        if (type === "teachers") {
            history.push('/user/teachers/create');
        } else if (type === "students") {
            history.push('/user/students/create');
        }
    }

    return (
        <div className="manage-user">
            <TitleCard
                title={type === "teachers" ? "Gestión de profesores" : "Gestión de alumnos"}
                color={type === "teachers" ? "#FFA552" : "#3C8AFF"}
            />
            <Container maxWidth="md">
                <form className="search-form d-flex justify-content-between mt-4">
                    <div className="text-field form-group mr-3">
                        <input className="form-control text-center" />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn-search btn btn-primary">Buscar</button>
                    </div>
                </form>
                <div className="" style={{ marginBottom: "100px" }}>
                    <UserList type={type} />
                </div>
                <button onClick={redirectCreate} className={type === "teachers" ? "btn btn-warning btn-create-user" : "btn btn-primary btn-create-user"}>
                    {
                        type === "teachers" ?
                            "Crear profesor"
                            :
                            "Crear estudiante"
                    }
                </button>
            </Container>
        </div>
    )
}