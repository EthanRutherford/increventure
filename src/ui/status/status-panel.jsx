import React, {memo, useState, useEffect, useCallback} from "react";
import {game} from "../../logic/game";
import {animationSteps} from "../../logic/game-loop";
import {useSaveData} from "../../logic/save-data";
import {coinKinds, parseCoins, parseCoinsShort} from "../../util/money";
import {TiledBg} from "../shared/tiled-bg";
import {Party} from "./party";
import rootStyles from "../../styles/root";
import partyStyles from "../../styles/party";
import coinStyles from "../../styles/coins";

import grass1 from "../../images/pngs/grass-1.png";
import grass2 from "../../images/pngs/grass-2.png";
import grass3 from "../../images/pngs/grass-3.png";
import grass4 from "../../images/pngs/grass-4.png";
import grass5 from "../../images/pngs/grass-5.png";

const tiles = [
	{url: grass1, weight: 16},
	{url: grass2, weight: 1, flipX: true},
	{url: grass3, weight: 1, flipX: true},
	{url: grass4, weight: 1, flipX: true},
	{url: grass5, weight: 1, flipX: true},
];

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

export function StatusPanel({createParticle}) {
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
				<Party />
			</div>
		</div>
	);
}
