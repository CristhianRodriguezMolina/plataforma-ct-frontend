import React, { useState, useEffect } from 'react';

// SCSS
import './UnitContent.scss';

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

	// Variable de estado para el modal
	const [open, setOpen] = useState(false);

	const updateName = (value) => {
		setUnitName(value);
	};

	const updateDes = (value) => {
		setUnitDes(value);
	};

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

	const handleChange = () => {
		setVisible(!visible);
	};

	const handleUpdateChanges = () => {
		props.onUpdateChanges({
			_id: props.unitValue._id,
			visible: visible,
			name: unitName,
			description: unitDes,
			tasks: props.unitValue.tasks
		});
	};

	const handleDeleteUnit = () => {
		props.onDeleteUnit(props.unitValue._id);
	}

	const handleAddTask = () => {
		props.onAddTask(props.unitValue._id);
	}

	const handleDeleteTask = (taskId) => {
		props.onDeleteTask(props.unitValue._id, taskId);
	}

	return (
		<div className="unit-content-container">
			<div className="unit-content-info">
				<DynamicInput dynamicInputValue={unitName} dynamicInputStyle={nameInputStyle} sendValue={updateName}></DynamicInput>
				<DynamicInput dynamicInputValue={unitDes} dynamicInputStyle={desInputStyle} sendValue={updateDes}></DynamicInput>
			</div>
			<div className="buttons-container d-flex justify-content-between">
				<button type="submit" onClick={handleUpdateChanges} className="custom-btn custom-btn-info p-2 m-2">Guardar cambios</button>
				<FormControlLabel className="switcher" label="Visible" control={
					<Switch
						checked={visible}
						onChange={handleChange}
						name="visibilty"
						color="primary"
					/>
				} />
			</div>
			{props.taskActivities ?
				<div className="cards-container">
					{props.unitValue.tasks.map((task, i) => {
						return <TaskCard key={i} taskActivities={props.taskActivities} courseId={props.course._id} unitId={props.unitValue._id} task={task} onDeleteTask={handleDeleteTask} />
					})}
					< div onClick={() => handleAddTask()} className="add-task-button">
						<AddBoxIcon style={{ color: "rgb(200, 200, 200)", fontSize: 40 }} />
						<p>Agregar nueva tarea</p>

					</div>
				</div>
				: ""}
			<button className="custom-btn custom-btn-delete p-2 ml-3" color="secondary" variant="contained" onClick={() => setOpen(!open)}>Borrar unidad</button>
			<AlertModal
				type="delete"
				open={open}
				handleClose={() => setOpen(!open)}
				message='¿Esta seguro que quiere borrar esta unidad del curso?'
				action={handleDeleteUnit}
			/>
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