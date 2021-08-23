import React, { useState, useEffect } from 'react';

const Timer = (props) => {
	//Timer vars
	const [second, setSecond] = useState('00');
	const [minute, setMinute] = useState('00');
	const [isActive, setIsActive] = useState(false);
	const [counter, setCounter] = useState(0);

	useEffect(() => {

		if(!props.isActive && (second !== '00' || minute !== '00')) {
			props.sendTime(minute, second);
		}

		setIsActive(props.isActive);
	}, [props.isActive]);

	//handle the timer
	useEffect(() => {
		let intervalId;

		if (isActive) {
			intervalId = setInterval(() => {
				const secondCounter = counter % 60;
				const minuteCounter = Math.floor(counter / 60);

				const computedSecond = String(secondCounter).length === 1 ? `0${secondCounter}`: secondCounter;
				const computedMinute = String(minuteCounter).length === 1 ? `0${minuteCounter}`: minuteCounter;

				setSecond(computedSecond);
				setMinute(computedMinute);

				setCounter(counter => counter + 1);
			}, 1000);
    	}

		return () => clearInterval(intervalId);
		
	}, [isActive, counter]);

	return (
		<div></div>
	);
};

export default Timer;
