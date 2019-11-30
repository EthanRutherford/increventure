import {useEffect} from "react";
import j from "react-jenny";
import {useUpdater} from "../../logic/util";
import {game} from "../../logic/game";
import {minions, minionKinds} from "../../logic/minions";
import Close from "../../images/svgs/close.svg";
import {parseCoinsShort} from "../money";
import coinStyles from "../../styles/coins";
import styles from "../../styles/middle-page";

const numberFormatter = new Intl.NumberFormat("en-US", {notation: "compact", compactDisplay: "short"});

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
