import React from "react";
import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {minions} from "../../logic/minions";
import {parseCoinsShort} from "../../util/money";
import minionStyles from "../../styles/minions";
import coinStyles from "../../styles/coins";

export function Minion({kind}) {
	const count = useWatchedValue(() => game.data.minions[kind]);
	const disabled = useWatchedValue(() => game.data.inventory.money < game.minionCosts[kind]);
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
