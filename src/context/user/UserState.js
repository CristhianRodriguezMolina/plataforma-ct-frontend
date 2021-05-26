import React, { useReducer } from 'react';

// API
import api from '../../services/api'

import UserReducer from './UserReducer';
import UserContext from './UserContext';

const UserState = (props) => {

    const initialState = {
        user: null
    };

    const [state, dispatch] = useReducer(UserReducer, initialState);

    const getUser = (user) => {
        
    };

    const getUserCourses = async() => {
        try {
            if(user){
                
            }
        } catch (error) {
            
        }
    }

    const isTeacher = () => {

    }

    const isStudent = () => {

    }

    const isAdmin = () => {

    }

    const user = {
        user: state.user,
        getUser,
        getUserCourses,
        isAdmin,
        isTeacher,
        isStudent 
    };

    return (
        <UserContext.Provider value={user}>
            {props.children}
        </UserContext.Provider>
    )

}

export default UserState;