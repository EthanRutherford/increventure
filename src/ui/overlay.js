import j from "react-jenny";
import {game} from "../logic/game";
import {CombatUI} from "./combat";
import styles from "../styles/overlay.css";

function renderOverlay(children) {
	return j({div: styles.content}, j({div: styles.overlay}, children));
}

export function Overlay() {
	game.useEncounter();

	if (game.encounter != null) {
		return renderOverlay(
			j([CombatUI, {encounter: game.encounter}]),
		);
	}

	return null;
}
