import React, { useEffect } from 'react'

export default function Error404() {

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        localStorage.setItem('navbar-color', '#424242')
    });

    return (
        <div>
            <h1>404 NOT FOUND</h1>
        </div>
    )
}
