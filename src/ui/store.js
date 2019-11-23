import j from "react-jenny";
import {game} from "../logic/game";
import {useDerivedData} from "../logic/save-data";
import {upgrades, upgradeIds} from "../logic/upgrades";
import {parseCoinsShort} from "./money";
import rootStyles from "../styles/root";
import storeStyles from "../styles/store";
import coinStyles from "../styles/coins";

function Upgrade({upgradeId}) {
	const upgrade = upgrades[upgradeId];
	const showUpgrade = useDerivedData(
		(data) => data,
		() => !game.data.upgrades[upgradeId] && upgrade.unlock(game.data),
	);
	const disabled = useDerivedData(
		(data) => data.inventory.money,
		() => game.data.inventory.money < upgrade.cost,
	);

	if (!showUpgrade) {
		return null;
	}

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

function Upgrades() {
	return upgradeIds.map((upgradeId) =>
		j([Upgrade, {upgradeId, key: upgradeId}]),
	);
}

export function Store() {
	return j({div: storeStyles.content}, [
		j({div: rootStyles.title}, "Store"),
		j([Upgrades]),
	]);
}
