import {randInt} from "../util";
import {targetKinds, effectKinds, statKinds} from "./effects";

export const itemDefs = {
	herb: {
		name: "Herb",
		cost: 100,
		max: 20,
		kind: effectKinds.restore,
		target: targetKinds.ally,
		stat: statKinds.hp,
		effect: () => ({amount: randInt(15, 30)}),
	},
	manaCrystal: {
		name: "Mana Crystal",
		cost: 100,
		max: 20,
		kind: effectKinds.restore,
		target: targetKinds.ally,
		stat: statKinds.mp,
		effect: () => ({amount: randInt(15, 30)}),
	},
};

export const itemIds = Object.keys(itemDefs);

export class ItemCollection {
	constructor(items) {
		for (const [id, count] of Object.entries(items)) {
			this[id] = count;
		}
	}
}

// add getters to prototype
for (const id of itemIds) {
	const def = itemDefs[id];
	let innerValue = 0;
	Object.defineProperty(ItemCollection.prototype, id, {
		get() {
			return innerValue;
		},
		set(v) {
			innerValue = Math.max(0, Math.min(v, def.max));
			return innerValue;
		},
	});
}
