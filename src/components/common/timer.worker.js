
var seconds = '00';
var minutes = '00';
var isActive = true;
var counter = 0;

onmessage = (e) => {

	let message = e.data;
	if (message === "getTime") {
		getTime();
	}
	else {
		counter = e.data;
		execute();
	}

}

function getTime() {
	postMessage({ minutes, seconds });
}

//start timer
function execute() {
	let intervalId;

	if (isActive) {

		intervalId = setInterval(() => {
			const secondsCounter = counter % 60;
			const minutesCounter = Math.floor(counter / 60);

			const computedSeconds = String(secondsCounter).length === 1 ? `0${secondsCounter}` : secondsCounter;
			const computedMinutes = String(minutesCounter).length === 1 ? `0${minutesCounter}` : minutesCounter;

			seconds = computedSeconds;
			minutes = computedMinutes;

			counter = counter + 1;
		}, 1000);
	}
}




