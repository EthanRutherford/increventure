import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import styles from "../../styles/header";

export function Header({setMiddle}) {
	const dungeonOpen = useWatchedValue(() => game.dungeon != null);

	return (
		<div className={styles.header}>
			<div className={styles.title}>Incre-venture</div>
			<div>
				<button
					className={styles.button}
					onClick={() => setMiddle("stats")}
					disabled={dungeonOpen}
				>
					Stats
				</button>
				<button
					className={styles.button}
					onClick={() => setMiddle("options")}
					disabled={dungeonOpen}
				>
					Options
				</button>
			</div>
		</div>
	);
}
