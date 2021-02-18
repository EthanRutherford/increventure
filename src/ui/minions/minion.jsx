import React from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {parseCoinsShort} from "../../util/money";
import minionStyles from "../../styles/minions";
import coinStyles from "../../styles/coins";

export function Minion({kind}) {
	const minion = game.minions[kind];
	const count = useWatchedValue(() => minion.count);
	const disabled = useWatchedValue(() => game.inventory.money < minion.cost);
	const coin = parseCoinsShort(minion.cost);
	return (
		<button
			className={minionStyles.button}
			onClick={() => game.buyMinion(minion)}
			disabled={disabled}
		>
			<div className={minionStyles.titleRow}>
				<h2>{minion.name}</h2>
				<h2>{count}</h2>
			</div>
			<div className={minionStyles.row}>
				<div className={minionStyles.cost}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				<div>{minion.desc}</div>
			</div>
		</button>
	);
}
