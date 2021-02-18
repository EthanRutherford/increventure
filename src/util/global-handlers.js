import {game} from "../logic/game";

document.addEventListener("keydown", (event) => {
	if (event.ctrlKey && event.key === "s") {
		event.preventDefault();
		game.save();
	}
});

let acc = 0;
document.addEventListener("mousemove", (event) => {
	acc += Math.sqrt(event.movementX ** 2, event.movementY ** 2);
});

setInterval(() => {
	game.stats.mouseDistance += acc;
	acc = 0;
}, 1000);
