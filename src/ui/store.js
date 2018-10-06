const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {upgrades, upgradeIds} = require("../logic/upgrades");
const {parseCoinsShort} = require("./money");
const storeStyles = require("../styles/store");
const coinStyles = require("../styles/coins");

class Upgrade extends Component {
	constructor(...args) {
		super(...args);
		this.upgrade = upgrades[this.props.upgradeId];
		this.state = {
			disabled: game.data.inventory.money < this.upgrade.cost,
		};
		game.watch.inventory.money(this, this.handleMoneyChange);
	}
	handleMoneyChange(money) {
		const disabled = money < this.upgrade.cost;
		if (this.state.disabled !== disabled) {
			this.setState({disabled});
		}
	}
	render() {
		const coin = parseCoinsShort(this.upgrade.cost);
		return j({button: {
			className: storeStyles.upgradeButton,
			onClick: () => game.buyUpgrade(this.props.upgradeId),
			disabled: this.state.disabled,
		}}, [
			j({div: storeStyles.upgradeTitleRow}, [
				j({h2: 0}, this.upgrade.name),
			]),
			j({div: storeStyles.upgradeRow}, [
				j({div: storeStyles.upgradeCost}, [
					j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
					coin.value,
				]),
				j({div: 0}, this.upgrade.desc),
			]),
		]);
	}
}

class Upgrades extends Component {
	constructor(...args) {
		super(...args);
		this.state = {upgradeIds: this.getVisibleUpgrades()};
		game.watch(this, this.handleChange);
	}
	getVisibleUpgrades() {
		return upgradeIds.filter((upgradeId) =>
			!game.data.upgrades[upgradeId] &&
			upgrades[upgradeId].unlock(game.data),
		);
	}
	checkIsEqual(list1, list2) {
		return list1.length === list2.length && list1.every(
			(item, index) => item.id === list2[index].id,
		);
	}
	handleChange() {
		const visibleUpgrades = this.getVisibleUpgrades();
		if (!this.checkIsEqual(this.state.upgradeIds, visibleUpgrades)) {
			this.setState({upgradeIds: visibleUpgrades});
		}
	}
	render() {
		return this.state.upgradeIds.map((upgradeId) =>
			j([Upgrade, {upgradeId, key: upgradeId}]),
		);
	}
}

module.exports = class Store extends Component {
	render() {
		return j({div: storeStyles.content}, [
			j([Upgrades]),
		]);
	}
};
