import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {dungeonDefs, dungeonKinds} from "../../logic/dungeons/dungeon";
import {DetailButton} from "../shared/detail-button";

function Dungeon({kind, precursor}) {
	const dungeonDef = dungeonDefs[kind];
	const disabled = useWatchedValue(() => game.inventory.money < dungeonDef.cost || game.dungeon != null);
	const shouldShow = useWatchedValue(() => precursor == null || game.clearedDungeons[precursor]);

	if (!shouldShow) {
		return null;
	}

	return (
		<DetailButton
			borderColor="steel-blue-pale"
			baseColor="steel-blue"
			title={dungeonDef.name}
			cost={dungeonDef.cost}
			desc={dungeonDef.desc}
			onClick={() => game.enterDungeon(kind)}
			disabled={disabled}
		/>
	);
}

export function Dungeons() {
	return dungeonKinds.map((kind, i, a) => (
		<Dungeon kind={kind} precursor={a[i - 1]} key={kind} />
	));
}
