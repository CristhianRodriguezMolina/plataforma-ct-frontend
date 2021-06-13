import React from 'react'

// Util
import * as util from '../../../util/util';

// COMPONENTS

// Avatar
import Avatar from '@material-ui/core/Avatar';

import Typography from '@material-ui/core/Typography';

// Tip de uso
import Tooltip from '@material-ui/core/Tooltip';

// Link
import { Link } from 'react-router-dom'

// Icons
import { Delete, Edit, Cached } from '@material-ui/icons'

export default function StudentCard(props) {

	// Datos que llegan por parametros del componente
	const { student, type } = props;



	return (
		<div className="user-modal-card">
			<div className="modal-card">
				<Avatar className="mr-2" src="https://picsum.photos/200/300" />
				<div className="mr-auto">
					<Typography component="h1">
						{student.first_name} {student.last_name}
						<br />
						<p className="text-muted d-inline">ID: {student.id}</p>
						<br />
						<p className="text-muted d-inline">Edad: {util.getAge(student.birth_date)}</p>
					</Typography>
				</div>
				<Typography variant="subtitle1">
					<div className="btn-group-sm btn-group-vertical">
						<Tooltip title="Borrar" aria-label="delete">
							<button className="btn btn-danger"><Delete /></button>
						</Tooltip>
						<Tooltip title="Editar" aria-label="edit">
							<Link to="info" className="btn btn-info"><Edit /></Link>
						</Tooltip>
						<Tooltip title="Progreso" aria-label="progress">
							<Link to="progress" className="btn btn-success"><Cached /></Link>
						</Tooltip>
					</div>
				</Typography>
			</div>
		</div>
	)
}
