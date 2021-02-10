import React from "react";
import styles from "../../styles/header";

export function Header({setMiddle}) {
	return (
		<div className={styles.header}>
			<div className={styles.title}>Incre-venture</div>
			<div>
				<button
					className={styles.button}
					onClick={() => setMiddle("stats")}
				>
					Stats
				</button>
				<button
					className={styles.button}
					onClick={() => setMiddle("options")}
				>
					Options
				</button>
			</div>
		</div>
	);
}
