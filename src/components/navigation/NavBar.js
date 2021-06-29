import React, { useContext } from 'react';

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

// Icons
import { Close, People, PeopleOutline, LibraryBooks, LibraryAdd, Computer } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
	navbar: {
		backgroundColor: localStorage.getItem('navbar-color')
	},
	offset: theme.mixins.toolbar
}))

function NavBar() {

	const { logoutHandler, navbarColor, isAdmin, isTeacher } = useContext(UserContext);

	const classes = useStyles();



	return (
		<>
			{
				localStorage.getItem('token') ?
					<div>
						<AppBar className="" style={{ backgroundColor: navbarColor }}>
							<Toolbar>
								<Container maxWidth="lg" className="d-flex justify-content-between align-items-center">
									<Typography className='' variant="h6">
										<Link className="link-app" to={isTeacher || isAdmin ? "/course/mycourses" : `/course/mycourses/${localStorage.getItem('user_name')}`}>
											<IconButton>
												App
											</IconButton>
										</Link>
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
												<Avatar src={`${process.env.REACT_APP_API_URL}/profile/${localStorage.getItem('user_image')}`} />
											</IconButton>
											<ul className="navbar-user-options dropdown-menu shadow" aria-labelledby="dropdownProfileMenu">
												<Typography variant="subtitle1">
													<li>
														<div className="navbar-user-options-header">
															<Avatar className="mr-3" src={`${process.env.REACT_APP_API_URL}/profile/${localStorage.getItem('user_image')}`} />
															<div className="d-flex flex-column">
																<p className="m-0 p-0">{localStorage.getItem('user_name')} {localStorage.getItem('user_last_name')}</p>
																<Link className="" to={`/profile/${localStorage.getItem('user_id')}/overview`}>Perfil</Link>
															</div>
														</div>
													</li>
													{
														isAdmin || isTeacher ?
															<>
																<div className="dropdown-divider"></div>
																{
																	isAdmin ?
																		<li><Link className="dropdown-item" to="/user/teachers"><People className="mr-2" color="action" /> Gestion de profesores</Link></li>
																		:
																		""
																}
																<li><Link className="dropdown-item" to="/user/students"><PeopleOutline className="mr-2" color="action" /> Gestión de estudiantes</Link></li>
															</>
															:
															""
													}
													<div className="dropdown-divider"></div>
													<li><Link className="dropdown-item" to={isTeacher || isAdmin ? "/course/mycourses" : `/course/mycourses/${localStorage.getItem('user_name')}`}><Computer className="mr-2" color="action" /> Mis cursos</Link></li>
													{
														isAdmin || isTeacher ?
															<>
																<li><Link className="dropdown-item" to="/activity/myactivities"><LibraryBooks className="mr-2" color="action" /> Mis actividades</Link></li>
																<li><Link className="dropdown-item" to="/activity/create"><LibraryAdd className="mr-2" color="action" /> Crear actividad</Link></li>
																<li><Link className="dropdown-item" to="/activity/maze"><LibraryAdd className="mr-2" color="action" /> Maze activity</Link></li>
																<div className="dropdown-divider"></div>
															</>
															:
															""
													}
													<li><Link onClick={() => logoutHandler()} className="dropdown-item" to="/"><Close className="mr-2" color="error" /> Cerrar sesión</Link></li>
												</Typography>
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