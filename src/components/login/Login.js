import React, { useEffect } from 'react'

export default function Login() {

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        localStorage.setItem('navbar-color', '#424242')
    });

    return (
        <div>
            
        </div>
    )
}
