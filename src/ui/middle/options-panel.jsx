import React, {useState, useCallback} from "react";
import {game} from "../../logic/game";
import Close from "../../images/svgs/close";
import styles from "../../styles/middle-page";

function useConfirm(onConfirm) {
	const [confirming, set] = useState(false);
	const handle = useCallback(() => set((value) => {
		if (value) {
			onConfirm();
		} else {
			setTimeout(() => set(false), 5000);
		}

		return !value;
	}), []);

	return [confirming, handle];
}

export function OptionsPanel({close}) {
	const [confirmWipe, handleWipe] = useConfirm(() => game.delete());

	return (
		<div className={styles.content}>
			<div className={styles.header}>
				<div className={styles.title}>Options</div>
				<button
					className={styles.closeButton}
					onClick={close}
				>
					<Close className={styles.closeIcon} />
				</button>
			</div>
			<div className={styles.wipeBorder} />
			<div className={styles.section}>
				<div className={styles.buttonRow}>
					<button
						className={styles.button}
						onClick={game.save}
					>
						save
					</button>
					<span className={styles.grey}>
						the game saves automatically every minute
					</span>
				</div>
				<div className={styles.buttonRow}>
					<button
						className={`${styles.button} ${styles.red}`}
						onClick={handleWipe}
					>
						{confirmWipe ? "really?" : "wipe save"}
					</button>
					<span className={styles.red}>
						reset save data completely
					</span>
				</div>
			</div>
		</div>
	);
}
