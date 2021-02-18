import {randRange} from "../util";
import {targetKinds, effectKinds, statKinds} from "./effects";

import slimeIcon from "../../images/svgs/slime";

/*
	stats affect a character's abilities
	str: affects how much damage a character does
	dex: affects how likely a character is to do critical hits or avoid damage
	con: affects how much health a character has
	int: affects how much mana a character has
	wis: affects how quickly a character levels up
	luck: gives a small boost to all chance-based events
*/

export const stats = {
	// adventurers
	hero: {
		str: 3,
		dex: 3,
		con: 3,
		int: 3,
		wis: 3,
		luck: 1,
	},
	warrior: {
		str: 4,
		dex: 3,
		con: 5,
		int: 1,
		wis: 2,
		luck: 1,
	},
	wizard: {
		str: 1,
		dex: 2,
		con: 2,
		int: 6,
		wis: 4,
		luck: 1,
	},
	cleric: {
		str: 2,
		dex: 1,
		con: 3,
		int: 4,
		wis: 5,
		luck: 1,
	},
	prodigy: {
		str: 1,
		dex: 1,
		con: 1,
		int: 1,
		wis: 10,
		luck: 2,
	},
	savant: {
		str: 4,
		dex: 0,
		con: 3,
		int: 8,
		wis: 0,
		luck: 1,
	},
	// enemies
	slime: {
		str: 1,
		dex: 1,
		con: 1,
		int: 1,
		wis: 1,
		luck: 1,
		image: slimeIcon,
	},
	skeleton: {
		str: 2,
		dex: 1,
		con: 1,
		int: 1,
		wis: 3,
		luck: 5,
	},
};

export const skills = {
	// adventurers
	hero: [
		{
			lvl: 1,
			name: "Heroic effort",
			desc: "Damages an enemy using everything you've got",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 10,
			effect(hero) {
				const multiplier = hero.str + hero.dex +
					hero.con + hero.int * hero.wis
				;
				return {
					damage: multiplier,
				};
			},
		},
	],
	warrior: [
		{
			lvl: 1,
			name: "Buff up",
			desc: "Throw more of your weight into your attacks for a few turns",
			kind: effectKinds.buff,
			target: targetKinds.self,
			stat: statKinds.str,
			mpCost: () => 10,
			effect(hero) {
				return {
					amount: hero.con,
					turns: 3,
				};
			},
		},
	],
	wizard: [
		{
			lvl: 1,
			name: "Magic Missile",
			desc: "The classic spell that never misses",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 10,
			effect(hero) {
				return {
					damage: hero.int * 5,
				};
			},
		},
	],
	cleric: [
		{
			lvl: 1,
			name: "Cure water",
			desc: "Heal one party member",
			kind: effectKinds.restore,
			target: targetKinds.ally,
			stat: statKinds.hp,
			mpCost: () => 10,
			effect(hero) {
				return {
					amount: hero.wis * 3,
				};
			},
		},
	],
	prodigy: [
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
				return {
					amount: Math.floor(randRange(min, max) * scale),
				};
			},
		},
	],
	savant: [
		{
			lvl: 1,
			name: "Fire",
			desc: "Cast fire from your fingertips",
			kind: effectKinds.damage,
			target: targetKinds.enemies,
			mpCost: () => 10,
			effect(hero) {
				return {
					amount: hero.int * 10,
				};
			},
		},
	],
	// enemies
	slime: [
		{
			lvl: 1,
			name: "Goop",
			desc: "Goops gloppity glorp on goopity gumprs",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 5,
			effect(slime) {
				return {
					amount: slime.str * 3,
				};
			},
		},
	],
	skeleton: [
		{
			lvl: 1,
			name: "Bone toss",
			desc: "Tosses a bone at an enemy",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 10,
			effect(skeleton) {
				return {
					amount: skeleton.str * 4,
				};
			},
		},
	],
};
