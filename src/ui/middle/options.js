import {useState, useCallback} from "react";
import j from "react-jenny";
import {game} from "../../logic/game";
import Close from "../../images/svgs/close.svg";
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

export function Options({close}) {
	const [confirmWipe, handleWipe] = useConfirm(() => {
		game.delete();
	});

	return j({div: styles.content}, [
		j({div: styles.header}, [
			j({div: styles.title}, "Options"),
			j({button: {
				className: styles.closeButton,
				onClick: close,
			}}, j([Close, styles.closeIcon])),
		]),
		j({div: styles.wipeBorder}),
		j({div: styles.section}, [
			j({div: styles.buttonRow}, [
				j({button: {
					className: styles.button,
					onClick: game.save,
				}}, "save"),
				j({span: styles.grey}, "the game saves automatically every minute"),
			]),
			j({div: styles.buttonRow}, [
				j({button: {
					className: `${styles.button} ${styles.red}`,
					onClick: handleWipe,
				}}, confirmWipe ? "really?" : "wipe save"),
				j({span: styles.red}, "reset save data completely"),
			]),
		]),
	]);
}
