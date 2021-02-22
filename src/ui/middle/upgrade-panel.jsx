import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {upgradeIds} from "../../logic/upgrades";
import {parseCoinsShort} from "../../util/money";
import storeStyles from "../../styles/store";
import coinStyles from "../../styles/coins";

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

	const coin = parseCoinsShort(upgrade.cost);

	return (
		<button
			className={storeStyles.upgradeButton}
			onClick={() => game.buyUpgrade(upgrade)}
			disabled={disabled}
		>
			<div className={storeStyles.upgradeTitleRow}>
				<h2>{upgrade.name}</h2>
			</div>
			<div className={storeStyles.upgradeRow}>
				<div className={storeStyles.upgradeCost}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				<div>{upgrade.desc}</div>
			</div>
		</button>
	);
}

export function Upgrades() {
	return upgradeIds.map((id) => (
		<Upgrade id={id} key={id} />
	));
}
