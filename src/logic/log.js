function pad(number) {
	return (number < 10 ? "0" : "") + number;
}

function getTimestamp() {
	const now = new Date();
	const hours = now.getHours();
	const minutes = now.getMinutes();
	const seconds = now.getSeconds();
	return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

export function logInfo(message) {
	const timestamp = getTimestamp();

	// eslint-disable-next-line no-console
	console.info(
		`%c${timestamp}%c - %c${message}`,
		"color: blue",
		"color: black",
		"color: grey",
	);
}
