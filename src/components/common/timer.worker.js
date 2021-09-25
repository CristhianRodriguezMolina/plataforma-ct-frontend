
var seconds = '00';
var minutes = '00';
var isActive = true;
var counter = 0;

onmessage = (e) => {

	console.log("The message is ");
	console.log(e.data)

	let message = e.data;
	if (message === "getTime") {
		getTime();
	}
	else {
		execute();
	}

}

function getTime() {
	console.log("sending")
	console.log(minutes, ": ", seconds)
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

			console.log(minutes, " :", seconds)

			counter = counter + 1;
		}, 1000);
	}

	// return () => clearInterval(intervalId);
}




