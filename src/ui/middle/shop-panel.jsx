import {game} from "../../logic/game";
import {useWatchedValue} from "../../logic/use-watched-value";
import {itemDefs, itemIds} from "../../logic/rpg/items";
import {DetailButton} from "../shared/detail-button";

function Item({id}) {
	const item = itemDefs[id];
	const disabled = useWatchedValue(() => game.inventory.money < item.cost || game.inventory.items[id] >= item.max);
	const count = useWatchedValue(() => game.inventory.items[id]);

	return (
		<DetailButton
			borderColor="steel-blue-pale"
			baseColor="steel-blue"
			title={item.name}
			count={count}
			cost={item.cost}
			onClick={() => game.buyItem(id)}
			disabled={disabled}
		/>
	);
}

export function Shop() {
	return itemIds.map((id) => (
		<Item id={id} key={id} />
	));
}
