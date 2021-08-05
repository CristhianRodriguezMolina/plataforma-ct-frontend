import React, { useEffect, useContext, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

// CONTEXT
import UserContext from '../../context/user/UserContext';

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

    let location = useLocation();

    // Variables del cotexto
    const { changeColor } = useContext(UserContext);

    // Datos que vienen como parametros en la ruta para este componente
    const { type } = useParams();

    // Actual type of the view (teacher or student)
    const [actualType, setActualType] = useState(type);

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        if (type === "teachers") {
            changeColor('#ffe0b2');
        } else if (type === "students") {
            changeColor('#bbdefb');
        }
    }, [type]);

    useEffect(() => {
        if (type !== "teachers" && type !== "students") {
            history.push('/')
        }
    }, [type])

    useEffect(() => {
        if (actualType !== type) {
            setActualType(type);
        }
    }, [location]);

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
                <div className="" style={{ marginBottom: "100px" }}>
                    <UserList type={type} />
                </div>
                <button onClick={redirectCreate} className={type === "teachers" ? "custom-btn custom-btn-danger btn-create-user" : "custom-btn custom-btn-primary btn-create-user"}>
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