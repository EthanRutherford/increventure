import React from "react";
import {game} from "../../logic/game";
import {CombatUI} from "../rpg/combat";
// import {DungeonUI} from "../../dungeon";
import styles from "../../styles/overlay.css";

function renderOverlay(children) {
	return (
		<div className={styles.content}>
			<div className={styles.overlay}>{children}</div>
		</div>
	);
}

export function Overlay() {
	game.useEncounter();

	if (game.encounter != null) {
		return renderOverlay(<CombatUI encounter={game.encounter} />);
	}

	// return renderOverlay(<DungeonUI />);

	return null;
}
