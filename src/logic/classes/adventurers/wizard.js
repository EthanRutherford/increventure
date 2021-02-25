import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";
import {lvlModPower} from "../skill-core";

export const wizardDef = {
	name: "Wizard",
	desc: "An adventurer skilled in the arcane arts, but lacking in athleticism",
	baseStats: {
		str: 1,
		dex: 2,
		con: 2,
		int: 6,
		wis: 4,
		luck: 1,
	},
	skills: [
		{
			lvl: 1,
			name: "Magic Missile",
			desc: "The classic spell that never misses",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 10,
			effect(hero) {
				const lvlMod = hero.lvl ** lvlModPower;
				return {amount: Math.round(hero.int * lvlMod * 3)};
			},
		},
		{
			lvl: 2,
			name: "Sap",
			desc: "Sap some mp from your foe",
			kind: effectKinds.drain,
			target: targetKinds.enemy,
			stat: statKinds.mp,
			mpCost: () => 5,
			effect(hero) {
				return {amount: hero.wis * hero.lvl * 2};
			},
		},
	],
};
