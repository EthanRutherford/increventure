import {randInt, randRange, WeightedSet} from "../util";
import {stats} from "./class-data";

export function lootMoney(lootLevel) {
	return Math.floor(randRange(5, 15) * lootLevel);
}

function lootXp(enemyKind, enemyLevel) {
	const {str, dex, con, int, wis, luck, xpMod} = stats[enemyKind];
	const xpBase = str + dex + con + int + wis + luck;
	const multiplier = enemyLevel * xpMod || 1;
	return Math.floor(xpBase * multiplier * randRange(1, 1.2));
}

const enemyLootTables = {
	slime: {
		lootCount: [0, 1],
		items: [{itemId: "herb", weight: 1}],
	},
	slimeKing: {
		lootCount: [1, 3],
		items: [
			{itemId: "herb", weight: 2},
			{itemId: "manaCrystal", weight: 1},
		],
	},
};

export function lootEnemy(enemyKind, enemyLevel) {
	const result = {money: lootMoney(enemyLevel), xp: lootXp(enemyKind, enemyLevel), items: {}};

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
