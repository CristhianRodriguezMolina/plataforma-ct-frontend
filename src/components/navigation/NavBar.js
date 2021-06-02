import React, { useState } from 'react';

// SCSS
import './NavBar.scss';

// COMPONENTS 

// Link
import { Link, withRouter } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';

import Toolbar from '@material-ui/core/Toolbar';

import IconButton from '@material-ui/core/IconButton';

import Typography from '@material-ui/core/Typography';

import Avatar from '@material-ui/core/Avatar';

import Menu from '@material-ui/core/Menu';

import MenuItem from '@material-ui/core/MenuItem'

function NavBar() {

    const [open, setOpen] = useState(false);

    return (
        <div className="navbar">
            <div className="ml-auto">
                <Link className="btn btn-info" to="/">Index</Link>
                <Link className="btn btn-info" to="/user/teachers">Teacher manage</Link>
                <Link className="btn btn-info" to="/user/students">Students manage</Link>
                <Link className="btn btn-info" to="/course/mycourses">My Courses</Link>
                <Link className="btn btn-info" to="/activity/myactivities">My Activities</Link>
                <Link className="btn btn-info" to="/activity/create">Create Activity</Link>      
            </div>
        </div>
    )
}

export default withRouter(NavBar);