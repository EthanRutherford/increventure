import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {DetailButton} from "../shared/detail-button";

export function Minion({kind}) {
	const minion = game.minions[kind];
	const count = useWatchedValue(() => minion.count);
	const unlocked = useWatchedValue(() => minion.unlock(game));
	const disabled = useWatchedValue(() => game.inventory.money < minion.cost);
	if (!unlocked) {
		return null;
	}

	return (
		<DetailButton
			title={minion.name}
			count={count}
			cost={minion.cost}
			desc={minion.desc}
			onClick={() => game.buyMinion(minion)}
			disabled={disabled}
		/>
	);
}
