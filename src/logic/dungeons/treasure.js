import {lootMoney} from "../rpg/loot";
import {randRange, WeightedSet} from "../util";

const lootTableDefs = [
	{
		itemId: "herb",
		getWeight: (lootLevel) => lootLevel < 7 ? 7 : Math.max(3, 12 - lootLevel),
	},
	{
		itemId: "manaCrystal",
		getWeight: (lootLevel) => lootLevel < 5 ? 5 : Math.max(2, 10 - lootLevel),
	},
];

export function lootTreasure(lootLevel) {
	const result = {money: lootMoney(lootLevel), items: {}};

	const lootSet = new WeightedSet();
	for (const def of lootTableDefs) {
		const weight = def.getWeight(lootLevel);
		lootSet.set(def.itemId, weight);
	}

	const lootCount = Math.floor(Math.sqrt(lootLevel) * randRange(.5, 1.5));
	for (let i = 0; i < lootCount; i++) {
		const itemId = lootSet.getRand();
		result.items[itemId] = (result.items[itemId] || 0) + 1;
	}

	return result;
}
