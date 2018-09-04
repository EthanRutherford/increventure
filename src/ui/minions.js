const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {minions, minionKinds} = require("../logic/minions");
const {parseCoinsShort} = require("./money");
const minionStyles = require("../styles/minions");
const coinStyles = require("../styles/coins");

class Minion extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			count: game.data.minions[this.props.kind],
			disabled: game.data.inventory.money < game.minionCosts[this.props.kind],
		};


		game.watch.minions[this.props.kind](this, this.handleCountChange);
		game.watch.inventory.money(this, this.handleMoneyChange);
	}
	handleCountChange(count) {
		this.setState({count});
	}
	handleMoneyChange(money) {
		const disabled = money < game.minionCosts[this.props.kind];
		if (this.state.disabled !== disabled) {
			this.setState({disabled});
		}
	}
	render() {
		const coin = parseCoinsShort(game.minionCosts[this.props.kind]);
		return j({button: {
			className: minionStyles.button,
			onClick: game.buyMinion[this.props.kind],
			disabled: this.state.disabled,
		}}, [
			j({div: minionStyles.titleRow}, [
				j({h2: 0}, minions[this.props.kind].name),
				j({h2: 0}, this.state.count),
			]),
			j({div: minionStyles.row}, [
				j({div: minionStyles.cost}, [
					j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
					coin.value,
				]),
				j({div: 0}, minions[this.props.kind].desc),
			]),
		]);
	}
}

module.exports = class Minions extends Component {
	render() {
		return j({div: minionStyles.content}, minionKinds.map((kind) =>
			j([Minion, {kind, key: kind}]),
		));
	}
};
