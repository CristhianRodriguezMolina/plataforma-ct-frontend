import React, { useEffect, useContext } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// SCSS
import './error.scss';

// COMPONENTS

//Link
import Link from '@material-ui/core/Link';

export default function Error404() {

    // Variables del contexto
    const { changeColor, isTeacher, isAdmin } = useContext(UserContext);

    // UseEffect para cambiar el color de la barra de navegación
    useEffect(() => {
        changeColor('#575757');
    });

    return (
        <div className="error404">
            <div className="body">
                <div className="div">
                    <aside><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/4424790/Mirror.png" alt="404 Image" />
                    </aside>
                    <main>
                        <h1>Sorry!</h1>
                        <p>
                            No eres suficientemente cool para visitar esta pagina o no existe <em>. . . como tu vida social.</em>
                        </p>
                        <Link className='btn btn404' href={localStorage.getItem('token') ? <>{isTeacher || isAdmin ? "/course/mycourses" : `/course/mycourses/${localStorage.getItem('user_name')}`}</> : '/'}>Ya puedes irte!</Link>
                    </main>
                </div>
            </div>
        </div>
    )
}
