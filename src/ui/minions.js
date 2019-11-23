import j from "react-jenny";
import {game} from "../logic/game";
import {useSaveData, useDerivedData} from "../logic/save-data";
import {minions, minionKinds} from "../logic/minions";
import {parseCoinsShort} from "./money";
import rootStyles from "../styles/root";
import minionStyles from "../styles/minions";
import coinStyles from "../styles/coins";

const Minion = function Minion({kind}) {
	useSaveData((data) => data.minions[kind]);
	const disabled = useDerivedData(
		(data) => data.inventory.money,
		() => game.data.inventory.money < game.minionCosts[kind],
	);

	const count = game.data.minions[kind];
	const coin = parseCoinsShort(game.minionCosts[kind]);
	return j({button: {
		className: minionStyles.button,
		onClick: game.buyMinion[kind],
		disabled,
	}}, [
		j({div: minionStyles.titleRow}, [
			j({h2: 0}, minions[kind].name),
			j({h2: 0}, count),
		]),
		j({div: minionStyles.row}, [
			j({div: minionStyles.cost}, [
				j({div: `${coinStyles[coin.kind]} ${coinStyles.coin}`}),
				coin.value,
			]),
			j({div: 0}, minions[kind].desc),
		]),
	]);
};

export function Minions() {
	return j({div: minionStyles.content}, [
		j({div: rootStyles.title}, "Minions"),
		...minionKinds.map((kind) =>
			j([Minion, {
				kind,
				key: kind,
			}]),
		),
	]);
}
