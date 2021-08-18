import React, { useState, useEffect, useRef } from 'react';

//SCSS
import './ProgressBar.scss'; 

const ProgressBar = (props) => {

	const { hasTitle, title, bgColor, percentage } = props;

	const [showLabel, setShowLabel] = useState(false);

	const filler = useRef(null);

	const fillerStyles = {
		width: `${percentage}%`,
		backgroundColor: bgColor,
	}

	useEffect(() => {

		if(filler && filler.current) {
			if(filler.current.offsetWidth > 50) {
				setShowLabel(true);
			}
		}
	}, [filler])

	return (
		<>
			{ hasTitle?
				<h1 className='progress-bar-title'>{title}</h1>
			:''}

			<div className='progress-bar-container'>
				<div ref={filler} className='filler' style={fillerStyles}>
					{showLabel?
						<span className='percentage-label'>{`${percentage}%`}</span>
						:
						<span className='percentage-label'>{''}</span>}
				</div>
			</div>
		</>
	);
};

export default ProgressBar;
