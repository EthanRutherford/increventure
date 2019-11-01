import j from "react-jenny";
import {game} from "../logic/game";
import {useSaveData} from "../logic/save-data";
import {upgrades, upgradeIds} from "../logic/upgrades";
import {parseCoinsShort} from "./money";
import storeStyles from "../styles/store";
import coinStyles from "../styles/coins";

function Upgrade({upgradeId}) {
	useSaveData((data) => data.inventory.money, 500);

	const upgrade = upgrades[upgradeId];

	const disabled = game.data.inventory.money < upgrade.cost;
	const coin = parseCoinsShort(upgrade.cost);

	return j({button: {
		className: storeStyles.upgradeButton,
		onClick: () => game.buyUpgrade(upgradeId),
		disabled,
	}}, [
		j({div: storeStyles.upgradeTitleRow}, [
			j({h2: 0}, upgrade.name),
		]),
		j({div: storeStyles.upgradeRow}, [
			j({div: storeStyles.upgradeCost}, [
				j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
				coin.value,
			]),
			j({div: 0}, upgrade.desc),
		]),
	]);
}

function getVisibleUpgrades() {
	return upgradeIds.filter((upgradeId) =>
		!game.data.upgrades[upgradeId] &&
		upgrades[upgradeId].unlock(game.data),
	);
}

function Upgrades() {
	useSaveData(null, 500);

	return getVisibleUpgrades().map((upgradeId) =>
		j([Upgrade, {upgradeId, key: upgradeId}]),
	);
}

export function Store() {
	return j({div: storeStyles.content}, [
		j([Upgrades]),
	]);
}
