import React, { useEffect, useReducer } from 'react';

import UserReducer from './UserReducer';
import UserContext from './UserContext';

// Types
import { SIGNIN, LOGOUT } from '../types';

const UserState = (props) => {

    const isLoggedInHandler = () => {
        const role = localStorage.getItem('token');
        if(role) return true;
        return false;
    }
    
    const isAdminHandler = () => {
        const role = localStorage.getItem('user_role');
        if(role){
            return role === "admin"? true : false;
        }
        return false;
    }
    
    const isTeacherHandler = () => {
        const role = localStorage.getItem('user_role');
        if(role){
            return role === "teacher"? true : false;
        }
        return false;
    }
    
    const isStudentHandler = () => {
        const role = localStorage.getItem('user_role');
        if(role){
            return role === "student"? true : false;
        }
        return false;
    }
    
    const signinHandler = () => {
        try {
            dispatch({ type: SIGNIN, payload: {
                isLoggedIn: isLoggedInHandler(),
                isAdmin: isAdminHandler(),
                isTeacher: isTeacherHandler(),
                isStudent: isStudentHandler(),
            } });
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

            dispatch({ type: LOGOUT, payload: {
                isLoggedIn: false,
                isAdmin: false,
                isTeacher: false,
                isStudent: false
            } });            
        } catch (error) {
            console.error(error);
        }
    }

    const initialState = {
        isLoggedIn: isLoggedInHandler(),
        isAdmin: isAdminHandler(),
        isTeacher: isTeacherHandler(),
        isStudent: isStudentHandler(),
        env: process.env
    };

    const [state, dispatch] = useReducer(UserReducer, initialState);

    useEffect(() => {
        console.log(state)
    }, [state])

    const user = {
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