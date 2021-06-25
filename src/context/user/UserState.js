import React, { useEffect, useReducer, useState } from 'react';

import UserReducer from './UserReducer';
import UserContext from './UserContext';

// Types
import { SIGNIN, LOGOUT } from '../types';

const UserState = (props) => {

    const isLoggedInHandler = () => {
        const token = localStorage.getItem('token');
        if (token) return true;

        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_image');
        localStorage.removeItem('token');
        localStorage.removeItem('created_at');

        return false;
    }

    const isAdminHandler = () => {
        const role = localStorage.getItem('user_role');
        if (role) {
            return role === "admin" ? true : false;
        }
        return false;
    }

    const isTeacherHandler = () => {
        const role = localStorage.getItem('user_role');
        if (role) {
            return role === "teacher" ? true : false;
        }
        return false;
    }

    const isStudentHandler = () => {
        const role = localStorage.getItem('user_role');
        if (role) {
            return role === "student" ? true : false;
        }
        return false;
    }

    const signinHandler = () => {
        try {
            dispatch({
                type: SIGNIN, payload: {
                    isLoggedIn: isLoggedInHandler(),
                    isAdmin: isAdminHandler(),
                    isTeacher: isTeacherHandler(),
                    isStudent: isStudentHandler(),
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const logoutHandler = () => {
        try {
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_image');
            localStorage.removeItem('token');
            localStorage.removeItem('created_at');

            dispatch({
                type: LOGOUT, payload: {
                    isLoggedIn: false,
                    isAdmin: false,
                    isTeacher: false,
                    isStudent: false
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    const initialState = {
        isLoggedIn: isLoggedInHandler(),
        isAdmin: isAdminHandler(),
        isTeacher: isTeacherHandler(),
        isStudent: isStudentHandler()
    };

    const [navbarColor, setNavbarColor] = useState('#ffcdd2')
    const [navbarFontColor, setNavbarFontColor] = useState('#000')
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const changeColor = (color) => {
        setNavbarColor(color);
    }

    const changeFontColor = (color) => {
        setNavbarFontColor(color);
    }

    const user = {
        navbarColor,
        navbarFontColor,
        changeColor,
        changeFontColor,
        signinHandler,
        logoutHandler,
        env: state.env,
        isLoggedIn: state.isLoggedIn,
        isAdmin: state.isAdmin,
        isTeacher: state.isTeacher,
        isStudent: state.isStudent
    };

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserState;