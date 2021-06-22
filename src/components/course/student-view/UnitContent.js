import React, { useState, useEffect } from 'react';

// SCSS
import './studentview.scss';

// COMPONENTS

import DynamicInput from '../../common/DynamicInput';

import TaskCard from '../task/TaskCard';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// Button
import Button from '@material-ui/core/Button';

// Modal de confirmacion de borrado
import AlertModal from '../../common/AlertModal';

import PropTypes from 'prop-types';

import AddBoxIcon from '@material-ui/icons/AddBox';

const UnitContent = props => {

	const [unitName, setUnitName] = useState("");
	const [unitDes, setUnitDes] = useState("");
	const [visible, setVisible] = useState(false);

	const [activities, setActivities] = useState(null);

	useEffect(() => {
		if (props.unitValue) {
			setUnitName(props.unitValue.name);
			setUnitDes(props.unitValue.description);
			setVisible(props.unitValue.visible);
		}
	}, [props.unitValue]);

	const nameInputStyle = {
		width: "100%",
		fontSize: "1.7em",
		margin: "0",
		padding: "0.4em 0.3em",
		lineHeight: "1.2em",
		fontWeight: "600"
	};

	const desInputStyle = {
		width: "100%",
		fontSize: "0.8em",
		margin: "0",
		padding: "0.7em",
		overflow: "hidden",
		lineHeight: "1.2em",
		fontWeight: "500",
		minHeight: "2.5em"
	};

	return (
		<div className="unit-content-container">
			<div className="unit-content-info">
				<h1 className="h4 mb-4">{unitName}</h1>
				<h1 className="h6">{unitDes}</h1>
			</div>
			<hr />
			<h1 className="h5 text-center mb-4">Actividades</h1>
			{props.activities ?
				<div className="cards-container">
					{props.unitValue.tasks.map((task, i) => (
						task.visible ?
							<TaskCard key={i} forStudent={true} activities={props.activities} courseId={props.course._id} unitId={props.unitValue._id} task={task} />
							:
							''
					))}
				</div>
				: ""}
		</div >
	)
};

UnitContent.propTypes = {
	unitValue: PropTypes.shape({
		name: PropTypes.string,
		description: PropTypes.string,
		visible: PropTypes.bool
	}),
	onUpdateChanges: PropTypes.func
}

export default UnitContent;