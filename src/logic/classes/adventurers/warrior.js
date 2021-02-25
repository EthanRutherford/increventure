import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";
import {lvlModPower} from "../skill-core";

export const warriorDef = {
	name: "Warrior",
	desc: "A brutish adventurer keen on smashing skulls and making mad gainz",
	baseStats: {
		str: 4,
		dex: 3,
		con: 5,
		int: 1,
		wis: 2,
		luck: 1,
	},
	skills: [
		{
			lvl: 1,
			name: "Buff up",
			desc: "Throw more of your weight into your attacks for a few turns",
			kind: effectKinds.buff,
			target: targetKinds.self,
			stats: [statKinds.str],
			mpCost: () => 10,
			effect(hero) {
				return {str: hero.con, turns: 3};
			},
		},
		{
			lvl: 2,
			name: "Slam",
			desc: "Slam into your enemy for high damage",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 15,
			effect(hero) {
				const lvlMod = hero.lvl ** lvlModPower;
				return {amount: Math.round(hero.str * lvlMod * 4)};
			},
		},
	],
};
