import React, { useEffect, useContext } from 'react'

// CONTEXT
import UserContext from '../../../context/user/UserContext';

// COMPONENTS

// Title card
import TitleCard from '../../common/TitleCard';

export default function ManageTask() {

	// Variables del cotexto
	const { changeColor } = useContext(UserContext);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#dcedc8');
	});

	return (
		<div>
			<TitleCard
				title="My Course"
				color="#B6E768"
			/>
			Manage task
		</div>
	)
}
