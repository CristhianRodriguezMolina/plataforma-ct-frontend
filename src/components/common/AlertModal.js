import React, { useEffect, useRef, useState } from 'react'

// SCSS
import './AlertModal.scss';

// COMPONENTS

// Modal
import { Modal } from '@material-ui/core';

// Iconos
import { Error, Info, CheckCircle } from '@material-ui/icons';

// Colors
import { green, blue } from '@material-ui/core/colors';

export default function AlertModal(props) {

	const { message, open, handleClose, action, type } = props;

	const [btnClass, setBtnClass] = useState('custom-btn custom-btn-delete ml-auto mr-2 p-2');

	const executeActionBtn = useRef(null);

	useEffect(() => {
		if (type === 'delete') {
			setBtnClass('custom-btn custom-btn-delete ml-auto mr-2 p-2');
		} else if (type === 'success') {
			setBtnClass('custom-btn custom-btn-success ml-auto mr-2 p-2');
		} else if (type === 'info') {
			setBtnClass('custom-btn custom-btn-info ml-auto mr-2 p-2');
		}
	});

	const executeAction = () => {
		executeActionBtn.current.disabled = true; // This is to avoid problems if the user press the button multiple times

		handleClose();
		action();
	}

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="simple-modal-title"
			aria-describedby="simple-modal-description"
		>
			<div className="alert-modal">
				<div className="alert-modal-header">
					{
						type === "delete" ?
							<Error color="error" fontSize="large" />
							:
							type === "success" ?
								<CheckCircle fontSize="large" style={{ color: green[500] }} />
								:
								type === "info" ?
									<Info fontSize="large" style={{ color: blue[500] }} />
									:
									""
					}
					<hr />
				</div>
				<div className="alert-modal-body">
					{message}
				</div>
				<div className="alert-modal-footer">
					<hr />
					<div>
						<button onClick={executeAction} ref={executeActionBtn} className={btnClass} color="secondary" variant="contained">{type === 'delete' ? 'Borrar' : 'Aceptar'}</button>
						<button onClick={handleClose} className='custom-btn p-2'>Cancelar</button>
					</div>
				</div>
			</div>
		</Modal>
	)
}
