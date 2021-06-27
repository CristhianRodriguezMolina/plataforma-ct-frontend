import React from 'react'

// util
import * as util from '../../util/util';

// COMPONENTS

// Material UI core
import { Grid } from '@material-ui/core';

// Link
import { Link } from 'react-router-dom'

export default function Overview(props) {

	// Variables que llegan por los props del componente
	const { user } = props;

	return (
		<div className='profile-data-content'>
			{
				user ?
					<>
						<h1 className='h3 mb-4'>Vista general de tu perfil</h1>
						<h1 className='h5 mb-4'>Datos personales</h1>
						<Grid container>
							<Grid item xs={6}><label>Nombres</label></Grid>
							<Grid item xs={6}><p>{user.first_name}</p></Grid>

							<Grid item xs={12}><hr /></Grid>

							<Grid item xs={6}><label>Apellidos</label></Grid>
							<Grid item xs={6}><p>{user.last_name}</p></Grid>

							<Grid item xs={12}><hr /></Grid>

							<Grid item xs={6}><label>Genero</label></Grid>
							<Grid item xs={6}><p>{util.getGenre(user.genre)}</p></Grid>

							<Grid item xs={12}><hr /></Grid>

							<Grid item xs={6}><label>Fecha de nacimiento</label></Grid>
							<Grid item xs={6}><p>{util.getSpanishDate(user.birth_date)}</p></Grid>

							<Grid item xs={12}><hr /></Grid>

							<Grid item xs={6}><label>Apellidos</label></Grid>
							<Grid item xs={6}><p>{util.getRole(user.role)}</p></Grid>

							<Grid item xs={12}><hr /></Grid>

							<Grid item xs={6}><label>Edad</label></Grid>
							<Grid item xs={6}><p>{util.getAge(user.birth_date)} años</p></Grid>

							{
								user.role === 'admin' || user.role === 'teacher' ?
									<>
										<Grid item xs={12}><hr /></Grid>

										<Grid item xs={6}><label>Telefono</label></Grid>
										<Grid item xs={6}><p>{user.phone === '' ? 'Aún no tiene telefono' : user.phone}</p></Grid>
									</>
									:
									''
							}
						</Grid>
					</>
					:
					''
			}
			{
				user ?
					user.role === 'admin' || user.role === 'teacher' ?
						<>
							<h1 className='h5 mt-4 mb-4'>Datos de perfil</h1>

							<Grid container>
								<Grid item xs={6}><label>Logros</label></Grid>
								<Grid item xs={6}><p>{
									user.achievements === '' ?
										'Aún no tiene logros' :
										<>
											{
												// This is to show the achievements considering the line breaks
												user.achievements.split('\n').map(line =>
													<>
														<>{line}</>
														<br />
													</>
												)
											}
										</>
								}</p></Grid>

								<Grid item xs={12}><hr /></Grid>

								<Grid item xs={6}><label>Email</label></Grid>
								<Grid item xs={6}><p>{user.email === '' ? 'Aún no tiene email' : user.email}</p></Grid>
							</Grid>
						</>
						:
						''
					:
					''
			}
			<div className='d-flex justify-content-end mt-4'>
				<Link to='edit-profile' className="custom-btn custom-btn-primary px-3 py-2 mb-3 mr-3">Editar datos de perfil</Link>
				<Link to='change-password' className="custom-btn custom-btn-primary px-3 py-2 mb-3">Cambiar contraseña</Link>
			</div>
		</div >
	)
}
