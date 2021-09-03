import React, { useContext, useEffect, useState } from 'react'

// CONTEXT
import UserContext from '../../context/user/UserContext';

// SCSS
import './PerspectivesView.scss';

// Util
import * as util from '../../util/util';

// Material-UI core
import { IconButton, Tooltip } from '@material-ui/core';

// Icons
import { Edit, Delete } from '@material-ui/icons';

const PerspectiveCard = (props) => {

	// Datos del contexto de usuario
	const { isAdmin, isTeacher } = useContext(UserContext);

	const { perspective } = props;

	const [open, setOpen] = useState(false);

	return (
		<div className='perspective-card-container'>
			{
				isAdmin || isTeacher ?
					<div className='delete-button'>
						<Tooltip title="Editar" aria-label="edit">
							<IconButton className="m-0 p-0 mr-2" color="primary" aria-label="Delete" onClick={() => setOpen(!open)}>
								<Edit />
							</IconButton>
						</Tooltip>
						<Tooltip title="Borrar" aria-label="delete">
							<IconButton className="m-0 p-0" color="secondary" aria-label="Delete" onClick={() => setOpen(!open)}>
								<Delete />
							</IconButton>
						</Tooltip>
					</div>
					: ''
			}
			<h4 className='title'>{perspective.course_name}</h4>
			<h5 className='subtitle text-muted'>{perspective.course_description}</h5>
			<p className='message'>{perspective.message}</p>
			<h4 className='teacher'><span className='text-muted'>Por el profesor: </span>{perspective.teacher_name}</h4>
			<h5 className='date text-muted'>{util.getCustomDate(perspective.createdAt)}</h5>
		</div>
	)
}

export default PerspectiveCard
