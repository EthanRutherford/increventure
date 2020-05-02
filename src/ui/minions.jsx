import React from "react";
import {game} from "../logic/game";
import {useSaveData, useDerivedData} from "../logic/save-data";
import {minions, minionKinds} from "../logic/minions";
import {parseCoinsShort} from "./money";
import {TiledBg} from "./tiled-bg";
import rootStyles from "../styles/root";
import minionStyles from "../styles/minions";
import coinStyles from "../styles/coins";

import stone1 from "../images/pngs/stone-1.png";
import stone2 from "../images/pngs/stone-2.png";
import stone3 from "../images/pngs/stone-3.png";
import stone4 from "../images/pngs/stone-4.png";
import stone5 from "../images/pngs/stone-5.png";
const tiles = [
	{url: stone1, weight: 20},
	{url: stone2, weight: 10, flipX: true, flipY: true, rotate: true},
	{url: stone3, weight: 10, flipX: true, flipY: true, rotate: true},
	{url: stone4, weight: 5, flipX: true, flipY: true, rotate: true},
	{url: stone5, weight: 1, flipX: true, flipY: true, rotate: true},
];

function Minion({kind}) {
	useSaveData((data) => data.minions[kind]);
	const disabled = useDerivedData(
		(data) => data.inventory.money,
		() => game.data.inventory.money < game.minionCosts[kind],
	);

	const count = game.data.minions[kind];
	const coin = parseCoinsShort(game.minionCosts[kind]);
	return (
		<button
			className={minionStyles.button}
			onClick={game.buyMinion[kind]}
			disabled={disabled}
		>
			<div className={minionStyles.titleRow}>
				<h2>{minions[kind].name}</h2>
				<h2>{count}</h2>
			</div>
			<div className={minionStyles.row}>
				<div className={minionStyles.cost}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				<div>{minions[kind].desc}</div>
			</div>
		</button>
	);
}

export function Minions() {
	return (
		<div className={minionStyles.wrapper}>
			<TiledBg
				className={minionStyles.stone}
				tiles={tiles}
				width={13}
			/>
			<div className={minionStyles.content}>
				<div className={rootStyles.title}>Minions</div>
				{minionKinds.map((kind) => (
					<Minion kind={kind} key={kind} />
				))}
			</div>
		</div>
	);
}
