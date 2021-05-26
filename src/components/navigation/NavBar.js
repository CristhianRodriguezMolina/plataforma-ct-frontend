import React from 'react';

// SCSS
import './NavBar.scss';

// COMPONENTS 

// Link
import { Link, withRouter } from 'react-router-dom';

function NavBar() {
    return (
        <div className="navbar">
            <div className="ml-auto">
                <Link className="btn btn-primary ml-auto mr-2" to="/">Index</Link>
                <Link className="btn btn-primary ml-auto mr-2" to="/course/mycourses">My Courses</Link>
                <Link className="btn btn-primary ml-auto mr-2" to="/activity/myactivities">My Activities</Link>
                <Link className="btn btn-primary ml-auto" to="/activity/create">Create Activity</Link>                
            </div>
        </div>
    )
}

export default withRouter(NavBar);