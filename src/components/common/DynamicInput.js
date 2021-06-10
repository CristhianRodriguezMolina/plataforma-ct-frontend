import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import './DynamicInput.scss';

const DynamicInput = props => {

	const [value, setValue] = useState(null);
	const [showInput, setShowInput] = useState(false);
	const [height, setHeight] = useState(0);

	const h1 = useRef(null);
	const input = useRef(null);

	useEffect(() => {
		// if(!value) {
		setValue(props.dynamicInputValue);
		// }
	}, [props.dynamicInputValue]);

	useEffect(() => {
		if (showInput) {
			input.current.focus();
			input.current.selectionStart = input.current.value.length;
			input.current.selectionEnd = input.current.value.length;
		}
	}, [showInput]);

	const handleInputClick = () => {
		setHeight(h1.current.clientHeight);
		setShowInput(true);
	}

	const handleKeyDownInput = (event) => {
		if (event.key === 'Enter') {
			setShowInput(false);
			props.sendValue(event.target.value);
		}

		event.target.style.height = 'inherit';
		event.target.style.height = `${event.target.scrollHeight}px`;
	}

	const newStyle = { ...props.dynamicInputStyle, height: height };

	const onChangeHandler = (evt) => {
		setValue(evt.target.value);
		// props.sendValue(evt.target.value);
	}

	const handleOnblur = async (evt) => {
		setShowInput(false);
		props.sendValue(evt.target.value);
	};

	return (
		<div className="dynamic-input-container">

			{showInput ?
				<textarea type="text" rows={1} style={newStyle} ref={input} onKeyDown={handleKeyDownInput}
					className="form-control dynamic-input" value={value} onBlur={handleOnblur}
					onChange={onChangeHandler}>
				</textarea>
				: <h1 style={props.dynamicInputStyle} ref={h1} onClick={handleInputClick} className="dynamic-label">{value}</h1>}
		</div>
	)
};

DynamicInput.propTypes = {
	dynamicInputValue: PropTypes.string,
	dynamicInputStyle: PropTypes.object,
	sendValue: PropTypes.func.isRequired
}

export default DynamicInput;