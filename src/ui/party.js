import {useState, useCallback, useRef} from "react";
import j from "react-jenny";
import {game} from "../logic/game";
import {useSaveData} from "../logic/save-data";
import {minions, minionKinds} from "../logic/minions";
import {randRange} from "../logic/util";
import {coinKinds, parseCoins, parseCoinsShort} from "./money";
import {Grass} from "./grass";
import Happy from "../images/svgs/happy";
import Meh from "../images/svgs/meh";
import Bad from "../images/svgs/bad";
import Dead from "../images/svgs/dead";
import HeroHat from "../images/svgs/hero-hat";
import WarriorHat from "../images/svgs/warrior-hat";
import WizardHat from "../images/svgs/wizard-hat";
import ClericHat from "../images/svgs/cleric-hat";
import partyStyles from "../styles/party";
import coinStyles from "../styles/coins";

const hatMap = {
	hero: j([HeroHat, partyStyles.heroHat]),
	warrior: j([WarriorHat, partyStyles.hat]),
	wizard: j([WizardHat, partyStyles.wizardHat]),
	cleric: j([ClericHat, partyStyles.hat]),
};

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

	const animate = useCallback(() => {
		timeout.current = null;
		if (adventurer.hp > 0) {
			setBounceBack((x) => !x);
		} else {
			handleAnimationEnd();
		}
	}, []);

	const handleAnimationEnd = useCallback(() => {
		if (timeout.current) return;
		timeout.current = setTimeout(animate, randRange(0, 2000));
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
		}}, [
			hatMap[adventurer.class],
			j([Face, {style: {filter: `grayscale(${1 - healthFraction})`}}]),
		]),
		adventurer.name,
	]);
}

export function Party(props) {
	const handleClick = useCallback((event) => {
		game.cutGrass();
		props.createParticle(event.pageX, event.pageY);
		props.createParticle(event.pageX, event.pageY);
		props.createParticle(event.pageX, event.pageY);
	}, []);

	return j({div: partyStyles.wrapper}, [
		j([Grass]),
		j({div: partyStyles.content}, [
			j({button: {className: partyStyles.grassButton, onClick: handleClick}}, [
				"cut grass",
			]),
			j([Coins]),
			j([Adventurer, {which: 0}]),
			j([Adventurer, {which: 1}]),
			j([Adventurer, {which: 2}]),
			j([Adventurer, {which: 3}]),
		]),
	]);
}
