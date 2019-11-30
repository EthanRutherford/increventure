import j from "react-jenny";
import styles from "../styles/header";

const renderLeft = () => [
	j({div: styles.title}, "Incre-venture"),
];

const renderRight = (setMiddle) => [
	j({button: {
		className: styles.button,
		onClick: () => setMiddle("stats"),
	}}, "Stats"),
	j({button: {
		className: styles.button,
		onClick: () => setMiddle("options"),
	}}, "Options"),
];

export function Header({setMiddle}) {
	return j({div: styles.header}, [
		j("div", renderLeft()),
		j("div", renderRight(setMiddle)),
	]);
}
