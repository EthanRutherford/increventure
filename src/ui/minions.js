import j from "react-jenny";
import {game} from "../logic/game";
import {useSaveData} from "../logic/save-data";
import {minions, minionKinds} from "../logic/minions";
import {parseCoinsShort} from "./money";
import minionStyles from "../styles/minions";
import coinStyles from "../styles/coins";

function Minion(props) {
	useSaveData((data) => data.minions[props.kind]);
	useSaveData((data) => data.inventory.money, 500);

	const count = game.data.minions[props.kind];
	const disabled = game.data.inventory.money < game.minionCosts[props.kind];

	const coin = parseCoinsShort(game.minionCosts[props.kind]);
	return j({button: {
		className: minionStyles.button,
		onClick: game.buyMinion[props.kind],
		disabled,
	}}, [
		j({div: minionStyles.titleRow}, [
			j({h2: 0}, minions[props.kind].name),
			j({h2: 0}, count),
		]),
		j({div: minionStyles.row}, [
			j({div: minionStyles.cost}, [
				j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
				coin.value,
			]),
			j({div: 0}, minions[props.kind].desc),
		]),
	]);
}

export function Minions() {
	return j({div: minionStyles.content}, minionKinds.map((kind) =>
		j([Minion, {kind, key: kind}]),
	));
}
