import {game} from "../logic/game";

document.addEventListener("keydown", (event) => {
	if (event.ctrlKey && event.key === "s") {
		event.preventDefault();
		game.save();
	}
});
