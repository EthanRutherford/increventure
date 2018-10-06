const {Component} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {minions, minionKinds} = require("../logic/minions");
const {randRange} = require("../logic/util");
const {coinKinds, parseCoins, parseCoinsShort} = require("./money");
const partyStyles = require("../styles/party");
const coinStyles = require("../styles/coins");

class Coins extends Component {
	constructor(...args) {
		super(...args);
		this.state = {
			money: game.data.inventory.money,
			moneyRate: this.calcMoneyRate(),
		};
		game.watch.inventory.money(this, this.handleMoneyChange);
		game.watch.upgrades(this, this.handleRateChange);
		game.watch.minions(this, this.handleRateChange);
	}
	handleMoneyChange(money) {
		this.setState({money});
	}
	handleRateChange() {
		this.setState({moneyRate: this.calcMoneyRate()});
	}
	calcMoneyRate() {
		return minionKinds.reduce((total, kind) =>
			total + game.data.minions[kind] * minions[kind].baseRate * game.multipliers[kind], 0,
		);
	}
	render() {
		const coins = parseCoins(this.state.money);
		const rateValue = parseCoinsShort(this.state.moneyRate);

		return j({div: coinStyles.coins}, [
			...coins.map((amount, index) => j({div: coinStyles.coinRow}, [
				j({div: `${coinStyles[coinKinds[index]]} ${coinStyles.coin}`}),
				amount,
			])),
			j({div: coinStyles.coinRate}, [
				`(${rateValue.value}`,
				j({div: `${coinStyles[rateValue.kind]} ${coinStyles.coin} ${coinStyles.reverseMargin}`}),
				"/s)",
			]),
		]);
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
		const waitTime = randRange(0, 2000);
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
