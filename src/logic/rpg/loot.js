import {randInt, randRange, WeightedSet} from "../util";

export function lootMoney(lootLevel) {
	return Math.floor(randRange(5, 15) * lootLevel);
}

const enemyLootTables = {
	slime: {
		lootCount: [0, 1],
		items: [{itemId: "herb", weight: 1}],
	},
};

export function lootEnemy(enemyKind, enemyLevel) {
	const result = {money: lootMoney(enemyLevel), items: {}};

	const lootTable = enemyLootTables[enemyKind];
	const lootSet = new WeightedSet();
	for (const item of lootTable.items) {
		lootSet.set(item.itemId, item.weight);
	}

	const lootCount = randInt(...lootTable.lootCount);
	for (let i = 0; i < lootCount; i++) {
		const itemId = lootSet.getRand();
		result.items[itemId] = (result.items[itemId] || 0) + 1;
	}

	return result;
}
