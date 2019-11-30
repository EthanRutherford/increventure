import j from "react-jenny";
import {game} from "../../logic/game";
import {useDerivedData} from "../../logic/save-data";
import {upgrades, upgradeIds} from "../../logic/upgrades";
import {parseCoinsShort} from "../money";
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

export function Upgrades() {
	return upgradeIds.map((upgradeId) =>
		j([Upgrade, {upgradeId, key: upgradeId}]),
	);
}
