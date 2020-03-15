import React, {memo, useState, useEffect, useCallback, useRef} from "react";
import {game} from "../logic/game";
import {animationSteps} from "../logic/game-loop";
import {useSaveData} from "../logic/save-data";
import {randRange} from "../logic/util";
import {coinKinds, parseCoins, parseCoinsShort} from "./money";
import {TiledBg} from "./tiled-bg";
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

import grass1 from "../images/pngs/grass-1.png";
import grass2 from "../images/pngs/grass-2.png";
import grass3 from "../images/pngs/grass-3.png";
import grass4 from "../images/pngs/grass-4.png";
import grass5 from "../images/pngs/grass-5.png";
const tiles = [
	{url: grass1, weight: 16},
	{url: grass2, weight: 1},
	{url: grass3, weight: 1},
	{url: grass4, weight: 1},
	{url: grass5, weight: 1},
];

const hatMap = {
	hero: <HeroHat className={partyStyles.heroHat} />,
	warrior: <WarriorHat className={partyStyles.hat} />,
	wizard: <WizardHat className={partyStyles.wizardHat} />,
	cleric: <ClericHat className={partyStyles.hat} />,
};

const CoinRate = memo(function CoinRate() {
	useSaveData((data) => [data.upgrades, data.minions]);

	const rateAmount = game.moneyRates.reduce((total, rate) => total + rate.amount, 0);
	const rateValue = parseCoinsShort(rateAmount);

	return (
		<div className={coinStyles.coinRate}>
			({rateValue.value}
			<div className={`${coinStyles[rateValue.kind]} ${coinStyles.coin} ${coinStyles.reverseMargin}`} />
			/s)
		</div>
	);
});

function Coins() {
	const [money, setMoney] = useState(game.data.inventory.money);
	useEffect(() => {
		function step(a, b, diff) {
			const rateAmount = game.moneyRates.reduce((total, rate) => total + rate.amount, 0);
			setMoney(game.data.inventory.money + (rateAmount * diff));
		}

		animationSteps.add(step);

		return () => animationSteps.delete(step);
	}, []);

	const coins = parseCoins(money).map((value, index) => ({
		kind: coinKinds[index], value,
	})).reverse();

	return (
		<div className={coinStyles.coins}>
			{coins.map((coin) => (
				<div className={coinStyles.coinBox} key={coin.kind}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					<div className={coinStyles.coinValue}>{coin.value}</div>
				</div>
			))}
			<CoinRate />
		</div>
	);
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

	return (
		<div className={partyStyles.character}>
			<div className={partyStyles.characterTitle}>
				<div
					className={`${partyStyles.characterHead} ${bounceBack ? partyStyles.bounceBack : ""}`}
					onAnimationEnd={handleAnimationEnd}
				>
					{hatMap[adventurer.class]}
					<Face style={{filter: `grayscale(${1 - hpRatio})`}} />
				</div>
				{adventurer.name}
			</div>
			<div className={partyStyles.characterClass}>{adventurer.class}</div>
			<div className={partyStyles.characterDetails}>
				<div className={partyStyles.characterBar}>
					<div
						className={partyStyles.characterHp}
						style={{width: `${hpRatio * 100}%`}}
					/>
				</div>
				<div className={partyStyles.characterBar}>
					<div
						className={partyStyles.characterMp}
						style={{width: `${mpRatio * 100}%`}}
					/>
				</div>
			</div>
			<div className={partyStyles.characterLevel}>
				level {adventurer.lvl}
			</div>
		</div>
	);
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

	return (
		<div className={partyStyles.wrapper}>
			<TiledBg
				className={partyStyles.grass}
				tiles={tiles}
				width={23}
			/>
			<div className={partyStyles.content}>
				<div className={rootStyles.title}>Party</div>
				<button className={partyStyles.grassButton} onClick={handleClick}>
					cut grass
				</button>
				<Coins />
				<Adventurer which={0} />
				<Adventurer which={1} />
				<Adventurer which={2} />
				<Adventurer which={3} />
			</div>
		</div>
	);
}
