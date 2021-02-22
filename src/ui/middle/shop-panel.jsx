import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {parseCoinsShort} from "../../util/money";
import {itemIds, items} from "../../logic/rpg/items";
import storeStyles from "../../styles/store";
import coinStyles from "../../styles/coins";

function Item({id}) {
	const item = items[id];
	const disabled = useWatchedValue(() => game.inventory.money < item.cost);
	const count = useWatchedValue(() => game.inventory.items[id]);
	const coin = parseCoinsShort(item.cost);

	return (
		<button
			className={storeStyles.upgradeButton}
			onClick={() => game.buyItem(id)}
			disabled={disabled}
		>
			<div className={storeStyles.upgradeTitleRow}>
				<h2>{item.name}</h2>
			</div>
			<div className={storeStyles.upgradeRow}>
				<div className={storeStyles.upgradeCost}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				<div>{count}</div>
			</div>
		</button>
	);
}

export function Shop() {
	return itemIds.map((id) => (
		<Item id={id} key={id} />
	));
}
