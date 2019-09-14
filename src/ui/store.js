const j = require("react-jenny");
const game = require("../logic/game");
const {useSaveData} = require("../logic/save-data");
const {upgrades, upgradeIds} = require("../logic/upgrades");
const {parseCoinsShort} = require("./money");
const storeStyles = require("../styles/store");
const coinStyles = require("../styles/coins");

function Upgrade(props) {
	useSaveData((data) => data.inventory.money, 500);

	const upgrade = upgrades[props.upgradeId];

	const disabled = game.data.inventory.money < upgrade.cost;
	const coin = parseCoinsShort(upgrade.cost);

	return j({button: {
		className: storeStyles.upgradeButton,
		onClick: () => game.buyUpgrade(props.upgradeId),
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

module.exports = function Store() {
	return j({div: storeStyles.content}, [
		j([Upgrades]),
	]);
};
