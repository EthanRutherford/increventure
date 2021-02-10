import React from "react";
import {game} from "../../logic/game";
import {useDerivedData} from "../../logic/save-data";
import {upgrades, upgradeIds} from "../../logic/upgrades";
import {parseCoinsShort} from "../../util/money";
import storeStyles from "../../styles/store";
import coinStyles from "../../styles/coins";

function Upgrade({upgradeId}) {
	const upgrade = upgrades[upgradeId];
	const shouldShow = useDerivedData(
		upgrade.getDeps,
		() => !game.data.upgrades[upgradeId] && upgrade.unlock(game.data),
	);
	const disabled = useDerivedData(
		(data) => data.inventory.money,
		() => game.data.inventory.money < upgrade.cost,
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
