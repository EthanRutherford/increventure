const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {coinKinds, parseCoins} = require("./money");
const partyStyles = require("../styles/party");
const coinStyles = require("../styles/coins");

class Coins extends Component {
	constructor(...args) {
		super(...args);
		this.state = {money: game.data.inventory.money};
		game.watch.inventory.money(this, this.handleMoneyChange);
	}
	handleMoneyChange(money) {
		this.setState({money});
	}
	render() {
		const coins = parseCoins(this.state.money);
		return j({div: coinStyles.coins}, coins.map((amount, index) =>
			j({div: coinStyles.coinRow}, [
				j({div: `${coinStyles[coinKinds[index]]} ${coinStyles.coin}`}),
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
		return j({div: partyStyles.content}, [
			j({button: {className: partyStyles.grassButton, onClick: this.handleClick}}, [
				"cut grass",
			]),
			j([Coins]),
		]);
	}
};
