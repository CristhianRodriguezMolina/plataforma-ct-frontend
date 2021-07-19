import React, { useState } from 'react'

// COMPONENTS

// Material-UI core
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

export default function ExpiredSessionConfirmation(props) {

	const [open, setOpen] = useState(true);

	const closeSession = () => {
		props.history.push('/');
	}

	return (
		<div>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
					Sesión expirada
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						La sesión actual expiró, por favor inicie sesión nuevamente
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<button className='custom-btn custom-btn-primary p-2' onClick={closeSession}>
						Aceptar
					</button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
