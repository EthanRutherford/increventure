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
		for (const id of itemIds) {
			const def = itemDefs[id];
			let innerValue = items[id];
			Object.defineProperty(this, id, {
				enumerable: true,
				get() {
					return innerValue;
				},
				set(v) {
					innerValue = Math.max(0, Math.min(v, def.max));
					return innerValue;
				},
			});
		}
	}
}

