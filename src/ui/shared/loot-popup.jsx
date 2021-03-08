import {useEffect} from "react";
import {game} from "../../logic/game";
import {itemDefs} from "../../logic/rpg/items";
import {parseCoinsShort} from "../../util/money";
import {Button} from "./button";
import coinStyles from "../../styles/coins";
import styles from "./loot-popup.css";

export function LootPopup({loot, dismiss}) {
	const coin = parseCoinsShort(loot.money);

	useEffect(() => {
		// obtain the items and such
		game.inventory.money += loot.money;
		for (const [itemId, count] of Object.entries(loot.items)) {
			game.inventory.items[itemId] += count;
		}

		if (loot.xp != null) {
			for (const adventurer of game.adventurers) {
				adventurer.gainXp(loot.xp);
			}
		}
	}, []);

	return (
		<div className={styles.lootPopup}>
			<div className={styles.content}>
				<div className={styles.title}>You received:</div>
				<div className={styles.money}>
					<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
					{coin.value}
				</div>
				{Object.entries(loot.items).map(([itemId, count]) => (
					<div className={styles.item} key={itemId}>
						{itemDefs[itemId].name} ({count})
					</div>
				))}
				{loot.xp != null && (
					<div className={styles.xp}>
						{loot.xp} xp
					</div>
				)}
			</div>
			<Button width="100%" height="50px" onClick={dismiss}>
				Nice!
			</Button>
		</div>
	);
}
