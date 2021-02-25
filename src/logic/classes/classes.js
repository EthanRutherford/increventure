import {heroDef} from "./adventurers/hero";
import {warriorDef} from "./adventurers/warrior";
import {wizardDef} from "./adventurers/wizard";
import {clericDef} from "./adventurers/cleric";
import {prodigyDef} from "./adventurers/prodigy";
import {savantDef} from "./adventurers/savant";
import {slimeDef} from "./monsters/slime";
import {slimeKingDef} from "./monsters/slime-king";
import {skeletonDef} from "./monsters/skeleton";

export const statDefs = {
	str: {
		name: "strength",
		desc: "how strong you are, affects how much damage your attacks do",
	},
	dex: {
		name: "Dexterity",
		desc: "how skillful you are, affects critical hit and dodge chance",
	},
	con: {
		name: "Constitution",
		desc: "how hearty you are, affects your maximum hp",
	},
	int: {
		name: "Intelligence",
		desc: "how much you know, affects your maximum mp",
	},
	wis: {
		name: "Wisdom",
		desc: "how wise you are, affects how quickly you level up",
	},
	luck: {
		name: "Luck",
		desc: "how lucky you are, affects all things chance-based",
	},
};

export const adventurerDefs = {
	hero: heroDef,
	warrior: warriorDef,
	wizard: wizardDef,
	cleric: clericDef,
	prodigy: prodigyDef,
	savant: savantDef,
};

export const monsterDefs = {
	slime: slimeDef,
	slimeKing: slimeKingDef,
	skeleton: skeletonDef,
};

export const adventurerKinds = Object.keys(adventurerDefs);
export const monsterKinds = Object.keys(monsterDefs);
