import SkeletonIcon from "../../../images/svgs/skeleton";
import {effectKinds, targetKinds} from "../../rpg/effects";
import {analyzeWords, construct} from "../name-gen";
import {lvlModPower} from "../skill-core";

const phonemes = analyzeWords([
	"skeleton",
	"spooky",
	"scary",
	"bone",
	"spine",
	"femur",
	"clavicle",
	"scapula",
	"vertibra",
	"clack",
	"click",
	"rickety",
	"shamble",
	"dry",
	"skull",
	"rib",
	"cage",
	"teeth",
	"fossil",
	"undead",
]);

export const skeletonDef = {
	name: "Skeleton",
	desc: "Spooky Scary!",
	image: SkeletonIcon,
	xpMod: 1,
	createName: construct(phonemes),
	baseStats: {
		str: 2,
		dex: 1,
		con: 1,
		int: 1,
		wis: 3,
		luck: 5,
	},
	skills: [
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
	lootTable: {
		lootCount: [0, 2],
		items: [
			{itemId: "herb", weight: 3},
			{itemId: "manaCrystal", weight: 2},
		],
	},
};
