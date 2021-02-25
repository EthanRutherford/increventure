import slimeKingIcon from "../../../images/svgs/slime-king";
import {effectKinds, statKinds, targetKinds} from "../../rpg/effects";
import {lvlModPower} from "../skill-core";
import {slimeDef} from "./slime";

export const slimeKingDef = {
	name: "Slime King",
	desc: "A slightly threatening pile of goop",
	image: slimeKingIcon,
	xpMod: 2,
	createName: slimeDef.createName,
	baseStats: {
		str: 2,
		dex: 2,
		con: 2,
		int: 2,
		wis: 2,
		luck: 2,
	},
	skills: [
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
	lootTable: {
		lootCount: [1, 3],
		items: [
			{itemId: "herb", weight: 3},
			{itemId: "manaCrystal", weight: 2},
		],
	},
};
