import React, { useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext'

// COMPONENTS

// Route
import { Route, Redirect } from 'react-router';


export default function ProtectedRoute({ component, type, ...options }) {

    const { isLoggedIn, isAdmin, isTeacher, isStudent } = useContext(UserContext);

    // En caso de que no se de el parametro de type, significa que cualquiera de los roles puede entrar a esta ruta
    // Por tanto se setea el type en los tres roles
    if(!type){ 
        type = "admin,teacher,student"
    }

    var typeMap = new Map();

    typeMap.set('admin', isAdmin && type.includes('admin')); // En caso de que sea admin y el tipo de ruta sea para admin
    typeMap.set('teacher', isTeacher && type.includes('teacher')); // En caso de que sea teacher y el tipo de ruta sea para teacher
    typeMap.set('student', isStudent && type.includes('student')); // En caso de que sea student y el tipo de ruta sea para student

    if(isLoggedIn && (typeMap.get('admin') || typeMap.get('teacher') || typeMap.get('student'))){
        return (
            <Route {...options} component={component} />
        )
    }else{
        if(isLoggedIn){
            return (
                <Redirect to="/course/mycourses" />
            )
        }else{
            return (
                <Redirect to='/unauthorized' />
            )
        }
    }
}
