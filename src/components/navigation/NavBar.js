import React, { useEffect, useState } from 'react';

// SCSS
import './NavBar.scss';

// COMPONENTS 

// Link
import { Link, withRouter } from 'react-router-dom';

// Appbar
import AppBar from '@material-ui/core/AppBar';

// Toolbar que va dentro del apppbar
import Toolbar from '@material-ui/core/Toolbar';

// Icono boton
import IconButton from '@material-ui/core/IconButton';

// Tipografia
import Typography from '@material-ui/core/Typography';

// Avatar
import Avatar from '@material-ui/core/Avatar';

// Container
import Container from '@material-ui/core/Container'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    navbar: {
        backgroundColor: localStorage.getItem('navbar-color')
    },
    offset: theme.mixins.toolbar
}))

function NavBar() {
    
    const classes = useStyles();

    const [color, setColor] = useState('#424242');

    useEffect(() => {
        setColor(localStorage.getItem('navbar-color'))
    }, [localStorage.getItem('navbar-color')]);
    
    return (
        <div>
            <AppBar style={{backgroundColor: color}}>
                <Toolbar>
                    <Container maxWidth="lg" className="d-flex justify-content-between align-items-center text-black">
                        <Typography variant="h6">
                            <IconButton>
                                APP
                            </IconButton>
                        </Typography>
                        <div className="dropdown">
                            <IconButton
                                className='dropdown-toggle'
                                id='dropdownProfileMenu'
                                data-toggle='dropdown'
                                aria-expanded='false'
                            >
                                <Avatar>
                                    H
                                </Avatar>
                            </IconButton>
                            <ul class="dropdown-menu" aria-labelledby="dropdownProfileMenu">
                                <li><Link className="dropdown-item" to="/">Index</Link></li>
                                <li><Link className="dropdown-item" to="/user/teachers">Teacher manage</Link></li>
                                <li><Link className="dropdown-item" to="/user/students">Students manage</Link></li>
                                <li><Link className="dropdown-item" to="/course/mycourses">My Courses</Link></li>
                                <li><Link className="dropdown-item" to="/activity/myactivities">My Activities</Link></li>
                                <li><Link className="dropdown-item" to="/activity/create">Create Activity</Link></li>
                            </ul>
                        </div>
                    </Container>
                </Toolbar>
            </AppBar>
            <div className={classes.offset}></div>
        </div>
    )
}

export default withRouter(NavBar);