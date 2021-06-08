import React, { useEffect } from 'react'

// SCSS
import './error.scss';

// COMPONENTS

//Link
import Link from '@material-ui/core/Link';

export default function Error404() {

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
                        <Link className='btn btn404' href={localStorage.getItem('token')?'/course/mycourses':'/'}>Ya puedes irte!</Link>
                    </main>
                </div>
            </div>
        </div>
    )
}
