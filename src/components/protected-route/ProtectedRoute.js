import React, { useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext'

import delay from 'delay';

// COMPONENTS

// Route
import { Route, Redirect } from 'react-router';

export default function ProtectedRoute({ component, type, ...options }) {

    const { isLoggedIn, isAdmin, isTeacher, isStudent, isSessionExpired, sessionExpiredHandler } = useContext(UserContext);

    const expire_at = localStorage.getItem('expire_at');
    var expired = false;
    if (expire_at) {
        const now = Date.now().valueOf() / 1000;
        if (now > parseInt(expire_at)) {
            console.log('Expirado protectedRoute')
            sessionExpiredHandler();
            expired = true;
            return (
                <Redirect to="/session-expired" />
            )
        }
    }


    console.log('paso')

    // En caso de que no se de el parametro de type, significa que cualquiera de los roles puede entrar a esta ruta
    // Por tanto se setea el type en los tres roles
    if (!type) {
        type = "admin,teacher,student"
    }

    var typeMap = new Map();

    typeMap.set('admin', isAdmin && type.includes('admin')); // En caso de que sea admin y el tipo de ruta sea para admin
    typeMap.set('teacher', isTeacher && type.includes('teacher')); // En caso de que sea teacher y el tipo de ruta sea para teacher
    typeMap.set('student', isStudent && type.includes('student')); // En caso de que sea student y el tipo de ruta sea para student

    if (isLoggedIn && (typeMap.get('admin') || typeMap.get('teacher') || typeMap.get('student')) && !expired) {
        return (
            <Route {...options} component={component} />
        )
    } else {
        if (expired) {
            return (
                <Redirect to="/session-expired" />
            )
        } else if (isLoggedIn) {
            return (
                <Redirect to="/unauthorized" />
            )
        } else {
            return (
                <Redirect to='/' />
            )
        }
    }
}
