import React from "react";
import {game} from "../../logic/game";
import {CombatUI} from "../rpg/combat";
import {DungeonUI} from "../rpg/dungeon";
import styles from "../../styles/overlay.css";
import {useWatchedValue} from "../../logic/use-watched-value";

export function Overlay() {
	const dungeon = useWatchedValue(() => game.dungeon);
	const encounter = useWatchedValue(() => game.dungeon != null ? game.dungeon.encounter : null);

	if (dungeon == null && encounter == null) {
		return null;
	}

	return (
		<div className={styles.content}>
			{dungeon != null && (
				<div className={styles.overlay}>
					<DungeonUI dungeon={dungeon} />
				</div>
			)}
			{encounter != null && (
				<div className={styles.overlay}>
					<CombatUI encounter={encounter} />
				</div>
			)}
		</div>
	);
}
