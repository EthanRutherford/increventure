import {randRange} from "../util";
import {targetKinds, effectKinds, statKinds} from "./effects";

export const items = {
	herb: {
		kind: effectKinds.restore,
		target: targetKinds.ally,
		stat: statKinds.hp,
		effect: () => ({amount: randRange(10, 15)}),
	},
};

export const itemIds = Object.keys(items);
