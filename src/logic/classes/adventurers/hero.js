import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";
import {lvlModPower} from "../skill-core";

export const heroDef = {
	name: "Hero",
	desc: "A well-rounded adventurer that can handle most any situation",
	baseStats: {
		str: 3,
		dex: 3,
		con: 3,
		int: 3,
		wis: 3,
		luck: 1,
	},
	skills: [
		{
			lvl: 1,
			name: "Heroic effort",
			desc: "Damages an enemy using everything you've got",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 10,
			effect(hero) {
				const base = hero.str + hero.dex + hero.con + hero.int + hero.wis;
				const lvlMod = hero.lvl ** lvlModPower;
				return {amount: Math.round(base * lvlMod)};
			},
		},
		{
			lvl: 2,
			name: "Inspire",
			desc: "Inspires allies to fight their hardest",
			kind: effectKinds.buff,
			target: targetKinds.allies,
			stats: [statKinds.str, statKinds.dex, statKinds.int, statKinds.wis],
			mpCost: () => 15,
			effect() {
				return {str: 1, dex: 1, int: 1, wis: 1, turns: 3};
			},
		},
	],
};
