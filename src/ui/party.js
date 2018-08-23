const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {coinKinds, parseCoins} = require("./money");

class Coins extends Component {
	constructor(...args) {
		super(...args);
		this.state = {money: game.data.inventory.money};
		this.handleMoneyChange = this.handleMoneyChange.bind(this);
	}
	componentDidMount() {
		game.watch.inventory.money(this.handleMoneyChange);
	}
	componentWillUnmount() {
		game.watch.inventory.money.off(this.handleMoneyChange);
	}
	handleMoneyChange(money) {
		this.setState({money});
	}
	render() {
		const coins = parseCoins(this.state.money);
		return j({div: "coins"}, coins.map((amount, index) =>
			j({div: "coin-row"}, [
				j({div: `${coinKinds[index]} coin`}),
				amount,
			]),
		));
	}
}

module.exports = class Party extends Component {
	constructor(...args) {
		super(...args);
		this.state = {money: game.data.money};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick(event) {
		game.cutGrass();
		this.props.createParticle(event.pageX, event.pageY);
		this.props.createParticle(event.pageX, event.pageY);
		this.props.createParticle(event.pageX, event.pageY);
	}
	render() {
		return j({div: "party-area"}, [
			j({button: {className: "grass-button", onClick: this.handleClick}}, [
				"cut grass",
			]),
			j([Coins]),
		]);
	}
};
