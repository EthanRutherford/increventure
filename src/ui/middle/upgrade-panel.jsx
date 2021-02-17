import React from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {upgrades, upgradeIds} from "../../logic/upgrades";
import {parseCoinsShort} from "../../util/money";
import storeStyles from "../../styles/store";
import coinStyles from "../../styles/coins";

function Upgrade({upgradeId}) {
	const upgrade = upgrades[upgradeId];
	const disabled = useWatchedValue(() => game.data.inventory.money < upgrade.cost);
	const shouldShow = useWatchedValue(
		() => !game.data.upgrades[upgradeId] && upgrade.unlock(game.data),
		() => upgrade.getDeps(game.data),
	);

	if (!shouldShow) {
		return null;
	}

	const coin = parseCoinsShort(upgrade.cost);

	return (
		<button
			className={storeStyles.upgradeButton}
			onClick={() => game.buyUpgrade(upgradeId)}
			disabled={disabled}
		>
			<div className={storeStyles.upgradeTitleRow}>
				<h2>{upgrade.name}</h2>
			</div>
			<div className={storeStyles.upgradeRow}>
				<div className={storeStyles.upgradeCost}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				<div>{upgrade.desc}</div>
			</div>
		</button>
	);
}

export function Upgrades() {
	return upgradeIds.map((upgradeId) => (
		<Upgrade upgradeId={upgradeId} key={upgradeId} />
	));
}
