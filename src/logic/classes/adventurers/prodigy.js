import {randRange} from "../../util";
import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";

export const prodigyDef = {
	name: "Prodigy",
	desc: "The most clever adventurer learns quickly, despite their young age",
	baseStats: {
		str: 1,
		dex: 1,
		con: 1,
		int: 1,
		wis: 10,
		luck: 2,
	},
	skills: [
		{
			lvl: 1,
			name: "Study",
			desc: "Observe your enemy closely",
			kind: effectKinds.restore,
			target: targetKinds.self,
			stat: statKinds.xp,
			mpCost: (hero) => hero.maxMp,
			effect(hero) {
				const min = hero.lvl;
				const max = hero.lvl + hero.luck;
				const scale = hero.wis;
				return {amount: Math.round(randRange(min, max) * scale)};
			},
		},
		{
			lvl: 2,
			name: "Flourish",
			desc: "Perform a fancy attack, might fail",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 15,
			effect(hero) {
				const chance = .5 + hero.luckBonus * hero.lvl;
				const success = Math.random() < chance;
				return {amount: success ? hero.lvl * 25 : 0};
			},
		},
	],
};
