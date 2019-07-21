const {useState, useCallback, useRef} = require("react");
const j = require("react-jenny");
const game = require("../logic/game");
const {useSaveData} = require("../logic/save-data");
const {minions, minionKinds} = require("../logic/minions");
const {randRange} = require("../logic/util");
const {coinKinds, parseCoins, parseCoinsShort} = require("./money");
const Happy = require("../svgs/happy");
const Meh = require("../svgs/meh");
const Bad = require("../svgs/bad");
const Dead = require("../svgs/dead");
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

	const coins = parseCoins(game.data.inventory.money).map((value, index) => ({
		kind: coinKinds[index], value,
	})).reverse();
	const rateValue = parseCoinsShort(calcMoneyRate());

	return j({div: coinStyles.coins}, [
		...coins.map((coin) => j({div: coinStyles.coinBox}, [
			j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
			j({div: coinStyles.coinValue}, coin.value),
		])),
		j({div: coinStyles.coinRate}, [
			`(${rateValue.value}`,
			j({div: `${coinStyles[rateValue.kind]} ${coinStyles.coin} ${coinStyles.reverseMargin}`}),
			"/s)",
		]),
	]);
}

function Adventurer(props) {
	const adventurer = game.adventurers[props.which];
	const [bounceBack, setBounceBack] = useState(false);
	const timeout = useRef(null);
	useSaveData((data) => data.adventurers[props.which]);

	const handleAnimationEnd = useCallback(() => {
		if (timeout.current) return;
		timeout.current = setTimeout(() => {
			timeout.current = null;
			if (adventurer.hp > 0) {
				setBounceBack((x) => !x);
			} else {
				handleAnimationEnd();
			}
		}, randRange(0, 2000));
	}, []);

	if (adventurer == null) {
		 return null;
	}

	const healthFraction = adventurer.hp / adventurer.maxHp;
	const Face = healthFraction > 2 / 3 ? Happy :
		healthFraction > 1 / 3 ? Meh :
			healthFraction > 0 ? Bad :
				Dead
	;

	return j({div: {
		className: partyStyles.character,
	}}, [
		j({div: {
			className: `${partyStyles.characterHead} ${bounceBack ? partyStyles.bounceBack : ""}`,
			onAnimationEnd: handleAnimationEnd,
		}}, j([Face, {style: {filter: `grayscale(${1 - healthFraction})`}}])),
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
