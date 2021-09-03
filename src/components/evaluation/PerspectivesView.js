import React, { useContext, useEffect } from 'react'

// SCSS
import './PerspectivesView.scss';

// CONTEXT
import UserContext from '../../context/user/UserContext';

// COMPONENTES

// Tarjeta de titulo
import TitleCard from '../common/TitleCard';

// Perspective card
import PerspectiveCard from './PerspectiveCard';

const PerspectivesView = () => {

	// Datos del contexto de usuario
	const { changeColor } = useContext(UserContext);

	// UseEffect para cambiar el color de la barra de navegación
	useEffect(() => {
		changeColor('#BFA7F3');
	});

	return (
		<div>
			<TitleCard
				title="Mis evaluaciones"
				color="#A386E4"
				colorFont='#fff'
			/>

			<div className='perspective-view-container container'>
				<PerspectiveCard
					perspective={{
						course_name: 'Nombre del curso',
						course_description: 'Descripción del curso',
						teacher_name: 'Carlos Mora',
						message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus non mi non malesuada. Aenean ultricies, augue ut mattis volutpat, libero mi cursus leo, sit amet maximus leo metus in dolor. Sed sed mi pharetra, posuere ex ut, tempor augue. Suspendisse vel odio eget mi aliquet sodales vel eu arcu. Maecenas eu semper enim. Duis blandit in orci in faucibus. Vestibulum vel aliquet ipsum. Nulla sit amet ex luctus odio imperdiet pulvinar quis nec purus. Proin ac congue tellus. Etiam pulvinar interdum nibh, at faucibus turpis lobortis ut. Praesent rutrum in sapien quis luctus. Nullam sollicitudin sapien id arcu tincidunt pharetra.',
						createdAt: new Date('2021-08-23T18:42:46.986+00:00')
					}}
				/>
				<PerspectiveCard
					perspective={{
						course_name: 'Nombre del curso',
						course_description: 'Descripción del curso',
						teacher_name: 'Carlos Mora',
						message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus non mi non malesuada. Aenean ultricies, augue ut mattis volutpat, libero mi cursus leo, sit amet maximus leo metus in dolor. Sed sed mi pharetra, posuere ex ut, tempor augue. Suspendisse vel odio eget mi aliquet sodales vel eu arcu. Maecenas eu semper enim. Duis blandit in orci in faucibus. Vestibulum vel aliquet ipsum. Nulla sit amet ex luctus odio imperdiet pulvinar quis nec purus. Proin ac congue tellus. Etiam pulvinar interdum nibh, at faucibus turpis lobortis ut. Praesent rutrum in sapien quis luctus. Nullam sollicitudin sapien id arcu tincidunt pharetra.',
						createdAt: new Date('2021-08-23T18:42:46.986+00:00')
					}}
				/>
				<PerspectiveCard
					perspective={{
						course_name: 'Nombre del curso',
						course_description: 'Descripción del curso',
						teacher_name: 'Carlos Mora',
						message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur tempus non mi non malesuada. Aenean ultricies, augue ut mattis volutpat, libero mi cursus leo, sit amet maximus leo metus in dolor. Sed sed mi pharetra, posuere ex ut, tempor augue. Suspendisse vel odio eget mi aliquet sodales vel eu arcu. Maecenas eu semper enim. Duis blandit in orci in faucibus. Vestibulum vel aliquet ipsum. Nulla sit amet ex luctus odio imperdiet pulvinar quis nec purus. Proin ac congue tellus. Etiam pulvinar interdum nibh, at faucibus turpis lobortis ut. Praesent rutrum in sapien quis luctus. Nullam sollicitudin sapien id arcu tincidunt pharetra.',
						createdAt: new Date('2021-08-23T18:42:46.986+00:00')
					}}
				/>
			</div>
		</div>
	)
}

export default PerspectivesView

