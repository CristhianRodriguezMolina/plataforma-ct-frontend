import React, { useState, useEffect } from 'react';

const Timer = (props) => {
	//Timer vars
	const [seconds, setSeconds] = useState('00');
	const [minutes, setMinutes] = useState('00');
	const [isActive, setIsActive] = useState(false);
	const [counter, setCounter] = useState(0);

	useEffect(() => {

			if(!props.isActive && (seconds !== '00' || minutes !== '00')) {
				props.sendTime(minutes, seconds);
			}

		setIsActive(props.isActive);
	}, [props.isActive]);

	//handle the timer
	useEffect(() => {
		let intervalId;

		if (isActive) {
			intervalId = setInterval(() => {
				const secondsCounter = counter % 60;
				const minutesCounter = Math.floor(counter / 60);

				const computedSeconds = String(secondsCounter).length === 1 ? `0${secondsCounter}`: secondsCounter;
				const computedMinutes = String(minutesCounter).length === 1 ? `0${minutesCounter}`: minutesCounter;

				setSeconds(computedSeconds);
				setMinutes(computedMinutes);

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
