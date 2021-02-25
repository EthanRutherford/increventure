import {effectKinds, targetKinds} from "../../rpg/effects";
import {lvlModPower} from "../skill-core";

export const savantDef = {
	name: "Savant",
	desc: "An adventurer of incredible skill, but low aptitude for learning new tricks",
	baseStats: {
		str: 4,
		dex: 0,
		con: 3,
		int: 8,
		wis: 0,
		luck: 1,
	},
	skills: [
		{
			lvl: 1,
			name: "Fire",
			desc: "Cast fire from your fingertips",
			kind: effectKinds.damage,
			target: targetKinds.enemies,
			mpCost: () => 10,
			effect(hero) {
				const lvlMod = hero.lvl ** lvlModPower;
				return {amount: Math.round(hero.int * lvlMod * 10)};
			},
		},
		{
			lvl: 1,
			name: "Heal",
			desc: "Restore health",
			kind: effectKinds.restore,
			target: targetKinds.self,
			mpCost: () => 10,
			effect(hero) {
				const lvlMod = hero.lvl ** lvlModPower;
				return {amount: Math.round(hero.int * lvlMod * 2)};
			},
		},
	],
};
