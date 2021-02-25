import {randInt, randRange, WeightedSet} from "../util";

export function lootMoney(lootLevel) {
	return Math.floor(randRange(5, 15) * lootLevel);
}

function lootXp(enemy) {
	const {lvl, str, dex, con, int, wis, luck, xpMod} = enemy;
	const xpBase = str + dex + con + int + wis + luck;
	const multiplier = lvl * xpMod;
	return Math.floor(xpBase * multiplier * randRange(1, 1.2));
}

export function lootEnemy(enemy) {
	const result = {money: lootMoney(enemy.lvl), xp: lootXp(enemy), items: {}};

	const lootSet = new WeightedSet();
	for (const item of enemy.lootTable.items) {
		lootSet.set(item.itemId, item.weight);
	}

	const lootCount = randInt(...enemy.lootTable.lootCount);
	for (let i = 0; i < lootCount; i++) {
		const itemId = lootSet.getRand();
		result.items[itemId] = (result.items[itemId] || 0) + 1;
	}

	return result;
}
