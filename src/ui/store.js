const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {upgradeList} = require("../logic/upgrades");
const {parseCoinsShort} = require("./money");

class Upgrade extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			disabled: game.data.inventory.money < this.props.upgrade.cost,
		};
		this.handleMoneyChange = this.handleMoneyChange.bind(this);
	}
	componentDidMount() {
		game.watch.inventory.money(this.handleMoneyChange);
	}
	componentWillUnmount() {
		game.watch.inventory.money.off(this.handleMoneyChange);
	}
	handleMoneyChange(money) {
		const disabled = money < this.props.upgrade.cost;
		if (this.state.disabled !== disabled) {
			this.setState({disabled});
		}
	}
	render() {
		const coin = parseCoinsShort(this.props.upgrade.cost);
		return j({button: {
			className: "upgrade-button",
			onClick: () => game.buyUpgrade(this.props.upgrade.id),
			disabled: this.state.disabled,
		}}, [
			j({div: "upgrade-title-row"}, [
				j({h2: 0}, this.props.upgrade.name),
			]),
			j({div: "upgrade-row"}, [
				j({div: "upgrade-cost"}, [
					j({div: `${coin.kind} coin`}),
					coin.value,
				]),
				j({div: 0}, this.props.upgrade.desc),
			]),
		]);
	}
}

class Upgrades extends Component {
	constructor(...args) {
		super(...args);
		this.state = {upgrades: this.getVisibleUpgrades()};
		this.handleChange = this.handleChange.bind(this);
	}
	componentDidMount() {
		game.watch(this.handleChange);
	}
	componentWillUnmount() {
		game.watch.off(this.handleChange);
	}
	getVisibleUpgrades() {
		return upgradeList.filter((item) =>
			!game.data.upgrades[item.id] &&
			item.unlock(game.data),
		);
	}
	checkIsEqual(list1, list2) {
		return list1.length === list2.length && list1.every(
			(item, index) => item.id === list2[index].id,
		);
	}
	handleChange() {
		const visibleUpgrades = this.getVisibleUpgrades();
		if (!this.checkIsEqual(this.state.upgrades, visibleUpgrades)) {
			this.setState({upgrades: visibleUpgrades});
		}
	}
	render() {
		return this.state.upgrades.map((upgrade) =>
			j([Upgrade, {upgrade, key: upgrade.id}]),
		);
	}
}

module.exports = class Store extends Component {
	render() {
		return j({div: "store-area"}, [
			j([Upgrades]),
		]);
	}
};
