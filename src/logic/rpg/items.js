import {randInt} from "../util";
import {targetKinds, effectKinds, statKinds} from "./effects";

export const items = {
	herb: {
		name: "Herb",
		cost: 100,
		kind: effectKinds.restore,
		target: targetKinds.ally,
		stat: statKinds.hp,
		effect: () => ({amount: randInt(15, 30)}),
	},
	manaCrystal: {
		name: "Mana Crystal",
		cost: 100,
		kind: effectKinds.restore,
		target: targetKinds.ally,
		stat: statKinds.mp,
		effect: () => ({amount: randInt(15, 30)}),
	},
};

export const itemIds = Object.keys(items);
