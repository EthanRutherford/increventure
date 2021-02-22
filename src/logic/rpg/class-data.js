import {randRange} from "../util";
import {targetKinds, effectKinds, statKinds} from "./effects";

import slimeIcon from "../../images/svgs/slime";
import slimeKingIcon from "../../images/svgs/slime-king";

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
	slimeKing: {
		str: 2,
		dex: 2,
		con: 2,
		int: 2,
		wis: 2,
		luck: 2,
		xpMod: 2,
		image: slimeKingIcon,
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

// lvlMod = being level raised to the .8th power
// this ensures skills continue to improve as you level up, but gradually fall behind,
// ensuring that higher-leveled skills are always an upgrade when they unlock.
const lvlModPower = .8;

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
	warrior: [
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
	wizard: [
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
	savant: [
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
				const lvlMod = slime.lvl ** lvlModPower;
				return {amount: Math.round(slime.str * lvlMod * 3)};
			},
		},
		{
			lvl: 4,
			name: "Glump",
			desc: "Glumps gloobery goo on grep",
			kind: effectKinds.buff,
			target: targetKinds.self,
			stats: [statKinds.str],
			mpCost: () => 10,
			effect() {
				return {str: 3, turns: 3};
			},
		},
	],
	slimeKing: [
		{
			lvl: 2,
			name: "Sludge",
			desc: "Tosses toxic sludge",
			kind: effectKinds.damage,
			target: targetKinds.enemy,
			mpCost: () => 15,
			effect(slimeKing) {
				const lvlMod = slimeKing.lvl ** lvlModPower;
				return {amount: Math.round(slimeKing.str * lvlMod * 4)};
			},
		},
		{
			lvl: 5,
			name: "Marinate",
			desc: "Soaks in its own sludge",
			kind: effectKinds.restore,
			target: targetKinds.self,
			stat: statKinds.hp,
			mpCost: () => 30,
			effect(slimeKing) {
				const lvlMod = slimeKing.lvl ** lvlModPower;
				return {amount: Math.round(slimeKing.con * lvlMod * 4)};
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
				const lvlMod = skeleton.lvl ** lvlModPower;
				return {amount: Math.round(skeleton.str * lvlMod * 4)};
			},
		},
	],
};
