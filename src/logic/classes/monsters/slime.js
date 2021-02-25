import slimeIcon from "../../../images/svgs/slime";
import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";
import {analyzeWords, construct} from "../name-gen";
import {lvlModPower} from "../skill-core";

const phonemes = analyzeWords([
	"slime",
	"goo",
	"gunk",
	"mucus",
	"mud",
	"sludge",
	"fungus",
	"glop",
	"mire",
	"ooze",
	"scum",
	"rot",
	"nasty",
	"sewage",
	"muck",
	"gross",
	"garbage",
	"filth",
	"ugliness",
	"trash",
	"bog",
	"marsh",
	"glob",
	"blob",
	"smear",
	"stain",
	"dump",
	"grump",
	"sleaze",
	"ectoplasm",
]);

export const slimeDef = {
	name: "Slime",
	desc: "A mostly non-threatening pile of goop",
	image: slimeIcon,
	xpMod: 1,
	createName: () => construct(phonemes),
	baseStats: {
		str: 1,
		dex: 1,
		con: 1,
		int: 1,
		wis: 1,
		luck: 1,
	},
	skills: [
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
	lootTable: {
		lootCount: [0, 1],
		items: [{itemId: "herb", weight: 1}],
	},
};
