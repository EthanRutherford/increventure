const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {minions, minionKinds} = require("../logic/minions");
const {parseCoinsShort} = require("./money");

class Minion extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			count: game.data.minions[this.props.kind],
			disabled: game.data.inventory.money < game.minionCosts[this.props.kind],
		};
		this.handleCountChange = this.handleCountChange.bind(this);
		this.handleMoneyChange = this.handleMoneyChange.bind(this);
	}
	componentDidMount() {
		game.watch.minions[this.props.kind](this.handleCountChange);
		game.watch.inventory.money(this.handleMoneyChange);
	}
	componentWillUnmount() {
		game.watch.minions[this.props.kind].off(this.handleCountChange);
		game.watch.inventory.money.off(this.handleMoneyChange);
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
			className: "minion-button",
			onClick: game.buyMinion[this.props.kind],
			disabled: this.state.disabled,
		}}, [
			j({div: "minion-title-row"}, [
				j({h2: 0}, minions[this.props.kind].name),
				j({h2: 0}, this.state.count),
			]),
			j({div: "minion-row"}, [
				j({div: "minion-cost"}, [
					j({div: `${coin.kind} coin`}),
					coin.value,
				]),
				j({div: 0}, minions[this.props.kind].desc),
			]),
		]);
	}
}

module.exports = class Minions extends Component {
	render() {
		return j({div: "minion-area"}, minionKinds.map((kind) =>
			j([Minion, {kind, key: kind}]),
		));
	}
};
