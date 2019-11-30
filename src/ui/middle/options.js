import j from "react-jenny";
import Close from "../../images/svgs/close.svg";
import styles from "../../styles/middle-page";

export function Options({close}) {
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
			"Coming soon",
		]),
	]);
}
