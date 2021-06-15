import React, { useState } from 'react'

// SCSS
import './ActivityCard.scss';

// COMPONENTS

// Link 
import { Link } from 'react-router-dom';

// Material UI Core
import { Tooltip } from '@material-ui/core';

// Modal de confirmación
import AlertModal from '../../common/AlertModal';

// Iconos
import { AccountTree, BorderVertical, Ballot, Delete, Edit } from '@material-ui/icons';

export default function ActivityCard(props) {

	const { activity } = props;

	const [open, setOpen] = useState(false);

	const deleteActivity = () => {

	}

	return (
		<div className="activity-card-container">
			<div className="activity-card">
				{
					activity.type.localeCompare("logic_sequence") === 0 ?
						<AccountTree fontSize="large" className="activity-icon" /> : activity.type.localeCompare("maze") === 0 ?
							<BorderVertical fontSize="large" className="activity-icon" /> : <Ballot fontSize="large" className="activity-icon" />
				}
				<div className="ml-2">
					{activity.name}
					<br />
					{activity.description}
				</div>
			</div>
			<div className="buttons-container">
				<div className="icon-buttons btn-group-vertical">
					<Tooltip title="Editar" aria-label="edit">
						<Link to='' className="btn btn-primary d-flex justify-content-center align-items-center" data-toggle="modal" data-target="#userDetail"><Edit /></Link>
					</Tooltip>
					<Tooltip title="Borrar" aria-label="delete">
						<button onClick={() => setOpen(!open)} className="btn btn-danger" data-toggle="modal" data-target="#deleteUser"><Delete /></button>
					</Tooltip>
				</div>
				<div className="group-buttons btn-group-vertical">
					<Link to='' className="btn btn-primary d-flex justify-content-center align-items-center" data-toggle="modal" data-target="#userDetail">Editar</Link>
					<button onClick={() => setOpen(!open)} className="btn btn-danger" data-toggle="modal" data-target="#deleteUser">Borrar</button>
				</div>
			</div>
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Esta seguro que quiere borrar esta actividad de la tarea?'
				action={deleteActivity}
			/>
		</div>
	)
}
