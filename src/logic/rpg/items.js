import {randInt} from "../util";
import {targetKinds, effectKinds, statKinds} from "./effects";

export const items = {
	herb: {
		name: "Herb",
		kind: effectKinds.restore,
		target: targetKinds.ally,
		stat: statKinds.hp,
		effect: () => ({amount: randInt(10, 15)}),
	},
};

export const itemIds = Object.keys(items);
