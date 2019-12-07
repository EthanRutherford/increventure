import {useEffect} from "react";
import j from "react-jenny";
import {useUpdater} from "../../logic/util";
import {game} from "../../logic/game";
import {minions, minionKinds} from "../../logic/minions";
import Close from "../../images/svgs/close.svg";
import {parseCoinsShort} from "../money";
import coinStyles from "../../styles/coins";
import styles from "../../styles/middle-page";

const dateFormatter = new Intl.DateTimeFormat("en-US", {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"});
const numberFormatter = new Intl.NumberFormat("en-US", {notation: "compact", compactDisplay: "short"});

const timeSince = (stamp) => {
	const seconds = Math.round((Date.now() - stamp) / 1000);

	if (seconds < 5) {
		return "Just now";
	}
	if (seconds < 60) {
		return `${seconds} seconds ago`;
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes} minutes, ${seconds % 60} seconds ago`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours} hours, ${minutes % 60} minutes ago`;
	}

	const days = Math.floor(hours / 24);
	if (days < 365) {
		return `${days} days, ${hours % 24} hours ago`;
	}

	// just print the date, rather than deal with leap years :P
	return dateFormatter.format(stamp);
};

const renderStat = (name, value) => j("div", [
	j({span: styles.grey}, [name, ": "]),
	value,
]);

const renderMoney = (amount) => {
	const coin = parseCoinsShort(amount);
	return j({div: coinStyles.coinInline}, [
		j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
		coin.value,
	]);
};

export function Stats({close}) {
	const updater = useUpdater();
	useEffect(() => {
		const interval = setInterval(updater, 5000);
		return () => clearInterval(interval);
	}, []);

	return j({div: styles.content}, [
		j({div: styles.header}, [
			j({div: styles.title}, "Stats"),
			j({button: {
				className: styles.closeButton,
				onClick: close,
			}}, j([Close, styles.closeIcon])),
		]),
		j({div: styles.wipeBorder}),
		j({div: styles.sectionHeader}, "General"),
		j({div: styles.wipeBorder40}),
		j({div: styles.section}, [
			renderStat("Game started",
				timeSince(game.data.stats.gameStarted),
			),
			renderStat("Total money earned",
				renderMoney(game.data.stats.totalMoney),
			),
			renderStat("Most money in pocket",
				renderMoney(game.data.stats.mostMoney),
			),
			renderStat("Total grass clicks",
				numberFormatter.format(game.data.stats.grassClicks),
			),
			renderStat("Total earned from clicking",
				renderMoney(game.data.stats.clickMoney),
			),
			renderStat("Mouse mileage",
				numberFormatter.format(game.data.stats.mouseDistance) + " px",
			),
		]),
		j({div: styles.sectionHeader}, "Money per Minion"),
		j({div: styles.wipeBorder40}),
		j({div: styles.section}, minionKinds.map((kind) =>
			renderStat(
				`${minions[kind].name} minions`,
				renderMoney(game.data.stats.minionMoney[kind]),
			),
		)),
	]);
}
