const {useState, useCallback} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {useSaveData} = require("../logic/save-data");
const {minions, minionKinds} = require("../logic/minions");
const {randRange} = require("../logic/util");
const {coinKinds, parseCoins, parseCoinsShort} = require("./money");
const partyStyles = require("../styles/party");
const coinStyles = require("../styles/coins");

function calcMoneyRate() {
	return minionKinds.reduce((total, kind) =>
		total + game.data.minions[kind] * minions[kind].baseRate * game.multipliers[kind], 0,
	);
}

function Coins() {
	useSaveData((data) => [
		data.inventory.money,
		data.upgrades,
		data.minions,
	]);

	const coins = parseCoins(game.data.inventory.money);
	const rateValue = parseCoinsShort(calcMoneyRate());

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

function Adventurer(props) {
	const [bounceBack, setBounceBack] = useState(false);
	useSaveData((data) => data.adventurers[props.which]);

	const handleAnimationEnd = useCallback(() => {
		window.setTimeout(() => {
			setBounceBack(!bounceBack);
		}, randRange(0, 2000));
	}, [bounceBack]);

	const adventurer = game.adventurers[props.which];
	if (adventurer == null) {
		 return null;
	}

	const healthFraction = adventurer.hp / adventurer.maxHp;
	const face = healthFraction > 2 / 3 ? ":)" :
		healthFraction > 1 / 3 ? ":|" :
			healthFraction > 0 ? ":(" :
				"xx";

	return j({div: {
		className: partyStyles.character,
	}}, [
		j({div: {
			className: `${partyStyles.characterHead} ${healthFraction ? "" : partyStyles.dead} ${bounceBack ? partyStyles.bounceBack : ""}`,
			style: {filter: `grayscale(${1 - healthFraction})`},
			onAnimationEnd: handleAnimationEnd,
		}}, face),
		adventurer.name,
	]);
}

module.exports = function Party(props) {
	const handleClick = useCallback((event) => {
		game.cutGrass();
		props.createParticle(event.pageX, event.pageY);
		props.createParticle(event.pageX, event.pageY);
		props.createParticle(event.pageX, event.pageY);
	}, []);

	return j({div: partyStyles.content}, [
		j({button: {className: partyStyles.grassButton, onClick: handleClick}}, [
			"cut grass",
		]),
		j([Coins]),
		j([Adventurer, {which: 0}]),
		j([Adventurer, {which: 1}]),
		j([Adventurer, {which: 2}]),
		j([Adventurer, {which: 3}]),
	]);
};
