import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

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

// Icons
import { Clear } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';

export default function UserManage({ history }) {

    // Variables del cotexto
    const { changeColor } = useContext(UserContext);

    // Datos que vienen como parametros en la ruta para este componente
    const { type } = useParams();

    // Text of the filed that is used to filter the students list
    const [searchInput, setSearchInput] = useState('');

    // Text that is used to filter the students list
    const [filterText, setFilterText] = useState('');

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
        if (searchInput === '') {
            setFilterText('');
        }
    }, [searchInput])

    // Method to change the variable that filter the users in the list of users    
    const changeFilterText = (e) => {
        e.preventDefault();

        setFilterText(searchInput.trim()); // Change the text to filter 
    }

    // Method to empty to the search field
    const handleClearSearchInput = () => {
        setSearchInput(''); // Set the input to empty
        setFilterText(''); // Set the text to filter to empty
    }

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
                <form onSubmit={changeFilterText} className="search-form d-flex justify-content-between mt-4">
                    <div className="text-field form-group mr-3">
                        <input className="form-control text-center w-100" value={searchInput} onChange={evt => setSearchInput(evt.target.value)} />
                        {
                            searchInput !== '' ?
                                <IconButton onClick={handleClearSearchInput} className='clear-button' size="sm">
                                    <Clear />
                                </IconButton>
                                :
                                ''
                        }
                    </div>
                    <div className="form-group">
                        <button type="submit" className="custom-btn custom-btn-search btn-search">Buscar</button>
                    </div>
                </form>
                <div className="" style={{ marginBottom: "100px" }}>
                    <UserList type={type} filterText={filterText} />
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