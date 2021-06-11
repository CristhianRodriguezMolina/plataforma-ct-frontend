import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// CONTEXT
import UserContext from '../../context/user/UserContext';

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

// Make styles
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	navbar: {
		backgroundColor: localStorage.getItem('navbar-color')
	},
	offset: theme.mixins.toolbar
}))

function NavBar() {

	const { logoutHandler } = useContext(UserContext);

	// Estilos de material UI
	const classes = useStyles();

	// Color basico de la navbar
	const [color, setColor] = useState('#424242');

	// Objeto de la ruta actual
	const router = useLocation();
	const [currentLocation, setCurrentLocation] = useState(router.pathname);
	const [currentColor, setCurrentColor] = useState(localStorage.getItem('navbar-color'))

	// UseEffect para cambiar el color de la navbar
	useEffect(() => {
		console.log(localStorage.getItem('navbar-color'));
		setColor(localStorage.getItem('navbar-color'));

		const changeColor = () => {
			if (currentLocation !== router.pathname) {
				setCurrentColor(localStorage.getItem('navbar-color'));
				setCurrentLocation(router.pathname);
				return true;
			} else {
				return false;
			}
		}
		changeColor();
	}, [currentColor]);

	useEffect(() => {
		setCurrentColor(localStorage.getItem('navbar-color'));
	})

	return (
		<>
			{
				localStorage.getItem('token') ?
					<div>
						<AppBar className="" style={{ backgroundColor: color }}>
							<Toolbar>
								<Container maxWidth="lg" className="d-flex justify-content-between align-items-center">
									<Typography variant="h6">
										<IconButton>
											APP
									</IconButton>
									</Typography>
									<div className="d-flex align-items-center">
										<Typography variant="h6" color="textSecondary" className="welcome-word">Bienvenido</Typography>
										<Typography variant="h6" color="textPrimary" className="ml-2">{localStorage.getItem('user_name')}</Typography>
										<div className="dropdown">
											<IconButton
												className='dropdown-toggle'
												id='dropdownProfileMenu'
												data-toggle='dropdown'
												aria-expanded='false'
											>
												<Avatar src={`${process.env.REACT_APP_API_URL}/profile/img1.jpg`} />
											</IconButton>
											<ul className="navbar-user-options dropdown-menu shadow" aria-labelledby="dropdownProfileMenu">
												{/* <Typography variant="subtitle2"> */}
												<li><Link className="dropdown-item" to="">Perfil</Link></li>
												<li><Link className="dropdown-item" to="/">Login</Link></li>
												<div className="dropdown-divider"></div>
												<li><Link className="dropdown-item" to="/user/teachers">Gestion de profesores</Link></li>
												<li><Link className="dropdown-item" to="/user/students">Gestión de estudiantes</Link></li>
												<div className="dropdown-divider"></div>
												<li><Link className="dropdown-item" to="/course/mycourses">Mis cursos</Link></li>
												<li><Link className="dropdown-item" to="/activity/myactivities">Mis actividades</Link></li>
												<li><Link className="dropdown-item" to="/activity/create">Crear actividad</Link></li>
												<div className="dropdown-divider"></div>
												<li><Link onClick={() => logoutHandler()} className="dropdown-item" to="/">Cerrar sesión</Link></li>
												{/* </Typography> */}
											</ul>
										</div>
									</div>
								</Container>
							</Toolbar>
						</AppBar>
						<div className={classes.offset}></div>
					</div>
					:
					""
			}
		</>
	)
}

export default withRouter(NavBar);