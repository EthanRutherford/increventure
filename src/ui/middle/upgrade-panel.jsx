import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {upgradeIds} from "../../logic/upgrades";
import {DetailButton} from "../shared/detail-button";

function Upgrade({id}) {
	const upgrade = game.upgrades[id];
	const disabled = useWatchedValue(() => game.inventory.money < upgrade.cost);
	const shouldShow = useWatchedValue(
		() => !upgrade.owned && upgrade.unlock(game),
		() => upgrade.getDeps(game),
	);

	if (!shouldShow) {
		return null;
	}

	return (
		<DetailButton
			borderColor="steel-blue-pale"
			baseColor="steel-blue"
			title={upgrade.name}
			cost={upgrade.cost}
			desc={upgrade.desc}
			onClick={() => game.buyUpgrade(upgrade)}
			disabled={disabled}
		/>
	);
}

export function Upgrades() {
	return upgradeIds.map((id) => (
		<Upgrade id={id} key={id} />
	));
}
