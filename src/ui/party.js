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

class Adventurer extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			...game.data[this.props.which],
			bounceBack: false,
		};

		game.watch[this.props.which](this, this.handleChange);
		this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
	}
	handleChange(value) {
		this.setState(value);
	}
	handleAnimationEnd() {
		if (this.timeout) return;
		const waitTime = Math.random() * 2000;
		this.timeout = window.setTimeout(() => {
			this.setState((state) => ({bounceBack: !state.bounceBack}));
			this.timeout = 0;
		}, waitTime);
	}
	render() {
		if (!this.state.created) return null;
		return j({div: {
			className: partyStyles.character,
		}}, [
			j({div: {
				className: `${partyStyles.characterHead} ${this.state.bounceBack ? partyStyles.bounceBack : ""}`,
				onAnimationEnd: this.handleAnimationEnd,
			}}, ":)"),
			this.state.name,
		]);
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
			j([Adventurer, {which: "adventurer1"}]),
			j([Adventurer, {which: "adventurer2"}]),
			j([Adventurer, {which: "adventurer3"}]),
			j([Adventurer, {which: "adventurer4"}]),
		]);
	}
};
