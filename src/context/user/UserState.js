import React, { useReducer } from 'react';

// API
import api from '../../services/api'

import UserReducer from './UserReducer';
import UserContext from './UserContext';

// Types
import { GET_USER, GET_USER_COURSES, SIGNIN, LOGOUT } from '../types';

const UserState = (props) => {

    const initialState = {
        user: null,
        courses: [],
        isLoggedIn: false,
        isAdmin: false,
        isTeacher: false,
        isStudent: false
    };

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const setUser = (user) => {
        try {
            dispatch({ type: GET_USER, payload: user });
        } catch (error) {
            console.error(error);
        }
    };

    const setUserCourses = async() => {
        try {
            if(user){
                const response = await api.get(`/api/course/mycourses/${user.user_id}`);

                const { courses } = response.data;

                if(courses){
                    dispatch({ type: GET_USER_COURSES, payload: courses })
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const isAdminHandler = () => {
        if(state.user){
            return state.user.user_role === "admin"? true : false;
        }
        return false;
    }

    const isTeacherHandler = () => {
        if(state.user){
            return state.user.user_role === "teacher"? true : false;
        }
        return false;
    }

    const isStudentHandler = () => {
        if(state.user){
            return state.user.user_role === "student"? true : false;
        }
        return false;
    }

    const signinHandler = () => {
        // Obtener los cursos del usuario que esta haciendo login
        setUserCourses();

        // Gestionar el rol del usuario que esta haciendo login
        dispatch({ type: SIGNIN, payload: {
            isLoggedIn: true,
            isAdmin: isAdminHandler(),
            isTeacher: isTeacherHandler(),
            isStudent: isStudentHandler()
        } });
    }

    const logoutHandler = () => {
        dispatch({ type: LOGOUT, payload: {
            user: null,
            courses: [],
            isLoggedIn: false,
            isAdmin: false,
            isTeacher: false,
            isStudent: false
        } });
    }

    const user = {
        user: state.user,
        courses: state.courses,
        setUser,
        setUserCourses,
        signinHandler,
        logoutHandler,
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