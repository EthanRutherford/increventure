import {memo, useState, useEffect, useCallback, useRef} from "react";
import j from "react-jenny";
import {game} from "../logic/game";
import {animationSteps} from "../logic/game-loop";
import {useSaveData} from "../logic/save-data";
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
import rootStyles from "../styles/root";
import partyStyles from "../styles/party";
import coinStyles from "../styles/coins";

const hatMap = {
	hero: j([HeroHat, partyStyles.heroHat]),
	warrior: j([WarriorHat, partyStyles.hat]),
	wizard: j([WizardHat, partyStyles.wizardHat]),
	cleric: j([ClericHat, partyStyles.hat]),
};

const CoinRate = memo(function CoinRate() {
	useSaveData((data) => [data.upgrades, data.minions]);

	const rateValue = parseCoinsShort(game.moneyRate);

	return j({div: coinStyles.coinRate}, [
		`(${rateValue.value}`,
		j({div: `${coinStyles[rateValue.kind]} ${coinStyles.coin} ${coinStyles.reverseMargin}`}),
		"/s)",
	]);
});

function Coins() {
	const [money, setMoney] = useState(game.data.inventory.money);
	useEffect(() => {
		function step(a, b, diff) {
			setMoney(game.data.inventory.money + (game.moneyRate * diff));
		}

		animationSteps.add(step);

		return () => animationSteps.delete(step);
	}, []);

	const coins = parseCoins(money).map((value, index) => ({
		kind: coinKinds[index], value,
	})).reverse();

	return j({div: coinStyles.coins}, [
		...coins.map((coin) => j({div: coinStyles.coinBox}, [
			j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
			j({div: coinStyles.coinValue}, [coin.value]),
		])),
		j([CoinRate]),
	]);
}

function Adventurer({which}) {
	const [bounceBack, setBounceBack] = useState(false);
	const timeout = useRef(null);
	useSaveData((data) => data.adventurers[which]);

	const animate = useCallback(() => {
		const adventurer = game.adventurers[which];
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

	const adventurer = game.adventurers[which];
	if (adventurer == null) {
		return null;
	}

	const hpRatio = adventurer.hp / adventurer.maxHp;
	const mpRatio = adventurer.mp / adventurer.maxMp;
	const Face = hpRatio > 2 / 3 ? Happy :
		hpRatio > 1 / 3 ? Meh :
			hpRatio > 0 ? Bad :
				Dead
	;

	return j({div: partyStyles.character}, [
		j({div: partyStyles.characterTitle}, [
			j({div: {
				className: `${partyStyles.characterHead} ${bounceBack ? partyStyles.bounceBack : ""}`,
				onAnimationEnd: handleAnimationEnd,
			}}, [
				hatMap[adventurer.class],
				j([Face, {style: {filter: `grayscale(${1 - hpRatio})`}}]),
			]),
			adventurer.name,
		]),
		j({div: partyStyles.characterClass}, adventurer.class),
		j({div: partyStyles.characterDetails}, [
			j({div: partyStyles.characterBar}, [
				j({div: {
					className: partyStyles.characterHp,
					style: {width: `${hpRatio * 100}%`},
				}}),
			]),
			j({div: partyStyles.characterBar}, [
				j({div: {
					className: partyStyles.characterMp,
					style: {width: `${mpRatio * 100}%`},
				}}),
			]),
		]),
		j({div: partyStyles.characterLevel}, [
			"level ",
			adventurer.lvl,
		]),
	]);
}

export function Party({createParticle}) {
	const handleClick = useCallback((event) => {
		const gain = game.cutGrass();
		const pretty = Math.round(gain * 10) / 10;

		createParticle({
			kind: "text",
			text: `+${pretty}`,
			x: event.pageX,
			y: event.pageY,
		});
		const grassData = {kind: "grass", x: event.pageX, y: event.pageY};
		createParticle(grassData);
		createParticle(grassData);
		createParticle(grassData);
	}, []);

	return j({div: partyStyles.wrapper}, [
		j([Grass]),
		j({div: partyStyles.content}, [
			j({div: rootStyles.title}, "Party"),
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
