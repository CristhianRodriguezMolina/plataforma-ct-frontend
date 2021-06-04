import React, { useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext'

// COMPONENTS

// Route
import { Route, Redirect } from 'react-router';


export default function ProtectedRoute({ component, type, ...options }) {

    const { isLoggedIn, isAdmin, isTeacher, isStudent } = useContext(UserContext);

    var typeMap = new Map();

    typeMap.set('admin', isAdmin && type === 'admin');
    typeMap.set('teacher', isTeacher && type === 'teacher');
    typeMap.set('student', isStudent && type === 'student');
    typeMap.set('admin-teacher', isStudent && type === 'admin-teacher');

    if(isLoggedIn && (typeMap.get(type) || !type)){
        return (
            <Route {...options} component={component} />
        )
    }else{
        return (
            <Redirect to='/' />
        )
    }
}
