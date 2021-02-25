import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";
import {lvlModPower} from "../skill-core";

export const clericDef = {
	name: "Cleric",
	desc: "A helpful adventurer, dedicated to keeping the party in top condition",
	baseStats: {
		str: 2,
		dex: 1,
		con: 3,
		int: 4,
		wis: 5,
		luck: 1,
	},
	skills: [
		{
			lvl: 1,
			name: "Cure water",
			desc: "Heal one party member",
			kind: effectKinds.restore,
			target: targetKinds.ally,
			stat: statKinds.hp,
			mpCost: () => 10,
			effect(hero) {
				const lvlMod = hero.lvl ** lvlModPower;
				return {amount: Math.round(hero.wis * lvlMod * 3)};
			},
		},
		{
			lvl: 2,
			name: "Curse",
			desc: "Temporarily reduce one enemy's stats",
			kind: effectKinds.debuff,
			target: targetKinds.enemy,
			stats: [statKinds.str, statKinds.dex, statKinds.int, statKinds.wis],
			mpCost: () => 15,
			effect() {
				return {str: 2, dex: 2, int: 2, wis: 2, turns: 3};
			},
		},
	],
};
