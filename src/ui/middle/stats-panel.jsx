import {useEffect} from "react";
import {useUpdater} from "../../logic/util";
import {game} from "../../logic/game";
import {minionKinds} from "../../logic/minions";
import Close from "../../images/svgs/close";
import {parseCoinsShort} from "../../util/money";
import coinStyles from "../../styles/coins";
import styles from "../../styles/middle-page";

const dateFormatter = new Intl.DateTimeFormat("en-US", {year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric"});
const numberFormatter = new Intl.NumberFormat("en-US", {notation: "compact", compactDisplay: "short"});

function timeSince(stamp) {
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
}

function renderStat(name, value) {
	return (
		<div key={name}>
			<span className={styles.grey}>{name} : {value}</span>
		</div>
	);
}

function renderMoney(amount) {
	const coin = parseCoinsShort(amount);
	return (
		<div className={coinStyles.coinInline}>
			<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
			{coin.value}
		</div>
	);
}

export function StatsPanel({close}) {
	const updater = useUpdater();
	useEffect(() => {
		const interval = setInterval(updater, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className={styles.content}>
			<div className={styles.header}>
				<div className={styles.title}>Stats</div>
				<button
					className={styles.closeButton}
					onClick={close}
				>
					<Close className={styles.closeIcon} />
				</button>
			</div>
			<div className={styles.wipeBorder} />
			<div className={styles.sectionHeader}>General</div>
			<div className={styles.wipeBorder40} />
			<div className={styles.section}>
				{renderStat("Game started",
					timeSince(game.stats.gameStarted),
				)}
				{renderStat("Total money earned",
					renderMoney(game.stats.totalMoney),
				)}
				{renderStat("Most money in pocket",
					renderMoney(game.stats.mostMoney),
				)}
				{renderStat("Total grass clicks",
					numberFormatter.format(game.stats.grassClicks),
				)}
				{renderStat("Total earned from clicking",
					renderMoney(game.stats.clickMoney),
				)}
				{renderStat("Mouse mileage",
					numberFormatter.format(game.stats.mouseDistance) + " px",
				)}
			</div>
			<div className={styles.sectionHeader}>Money per Minion</div>
			<div className={styles.wipeBorder40} />
			<div className={styles.section}>
				{minionKinds.map((kind) => renderStat(
					`${game.minions[kind].name} minions`,
					renderMoney(game.stats.minionMoney[kind]),
				))}
			</div>
		</div>
	);
}
