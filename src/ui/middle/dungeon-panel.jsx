import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {parseCoinsShort} from "../../util/money";
import {dungeonDefs, dungeonKinds} from "../../logic/dungeons/dungeon";
import storeStyles from "../../styles/store";
import coinStyles from "../../styles/coins";

function Dungeon({kind, precursor}) {
	const dungeonDef = dungeonDefs[kind];
	const disabled = useWatchedValue(() => game.inventory.money < dungeonDef.cost || game.dungeon != null);
	const shouldShow = useWatchedValue(() => precursor == null || game.clearedDungeons[precursor]);

	if (!shouldShow) {
		return null;
	}

	const coin = parseCoinsShort(dungeonDef.cost);

	return (
		<button
			className={storeStyles.upgradeButton}
			onClick={() => game.enterDungeon(kind)}
			disabled={disabled}
		>
			<div className={storeStyles.upgradeTitleRow}>
				<h2>{dungeonDef.name}</h2>
			</div>
			<div className={storeStyles.upgradeRow}>
				<div className={storeStyles.upgradeCost}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				<div>{dungeonDef.desc}</div>
			</div>
		</button>
	);
}

export function Dungeons() {
	return dungeonKinds.map((kind, i, a) => (
		<Dungeon kind={kind} precursor={a[i - 1]} key={kind} />
	));
}
