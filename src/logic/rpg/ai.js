import {randItem, WeightedSet} from "../util";
import {effectKinds, mapTarget} from "./effects";
import {actionKinds} from "./actions";
import {items} from "./items";

// personalities are collections of effect weights
// for pseudo-balance, the weights should total to 20
export const personalities = {
	neutral: {
		damage: 5,
		restore: 5,
		buff: 5,
		debuff: 5,
	},
	aggressive: {
		damage: 8,
		restore: 4,
		buff: 2,
		debuff: 6,
	},
	supportive: {
		damage: 3,
		restore: 8,
		buff: 7,
		debuff: 2,
	},
};

function mapSkill(skill, self, allies, enemies) {
	const {options, all} = mapTarget(skill.target, self, allies, enemies);
	const targets = all ? options : [randItem(options)];
	return {kind: actionKinds.skill, skill, targets};
}
function mapItem(itemId, self, allies) {
	const {options, all} = mapTarget(items[itemId].target, self, allies);
	const targets = all ? options : [randItem(options)];
	return {kind: actionKinds.item, itemId, targets};
}

// AI uses a personality to control a being
export class AI {
	constructor(being, personality) {
		this.being = being;
		this.personality = personality;
	}
	decide(allies, enemies) {
		/* TODO
			AI currently does not consider whether it *should* heal itself or allies; it
			only knows if it *can*, and will use healing skills/items even if there is no
			need to heal. Additionally, it would probably be good to have AI controlled
			beings discern between self buffs/restores and ally buffs/restores, as well
			as the different stats it might restore.
		*/

		const damageSkills = [];
		const restoreSkills = [];
		const buffSkills = [];
		const debuffSkills = [];
		for (const skill of this.being.skills) {
			if (skill.mpCost(this.being) > this.being.mp) {
				continue;
			}

			if (skill.kind === effectKinds.damage) {
				damageSkills.push(skill);
			} else if (skill.kind === effectKinds.restore) {
				restoreSkills.push(skill);
			} else if (skill.kind === effectKinds.buff) {
				buffSkills.push(skill);
			} else if (skill.kind === effectKinds.debuff) {
				debuffSkills.push(skill);
			}
		}

		const restoreItems = [];
		const buffItems = [];
		for (const [itemId, itemCount] of Object.entries(this.being.items)) {
			if (itemCount === 0) {
				continue;
			}

			const item = items[itemId];
			if (item.kind === effectKinds.restore) {
				restoreItems.push(itemId);
			} else if (item.kind === effectKinds.buff) {
				buffItems.push(itemId);
			}
		}

		const intents = new WeightedSet();
		intents.set(effectKinds.damage, this.personality.damage);
		if (restoreSkills.length + restoreItems.length > 0) {
			intents.set(effectKinds.restore, this.personality.restore);
		}
		if (buffSkills.length + buffItems.length > 0) {
			intents.set(effectKinds.buff, this.personality.buff);
		}
		if (debuffSkills.length > 0) {
			intents.set(effectKinds.debuff, this.personality.debuff);
		}

		const intent = intents.getRand();
		if (intent === effectKinds.damage) {
			if (damageSkills.length > 0 && randItem([true, false])) {
				return mapSkill(randItem(damageSkills), this.being, allies, enemies);
			}

			return {kind: actionKinds.attack, targets: [randItem(enemies)]};
		} else if (intent === effectKinds.restore) {
			let useSkill = restoreSkills.length > 0;
			const useItem = restoreItems.length > 0;
			if (useSkill && useItem) {
				useSkill = randItem([true, false]);
			}

			if (useSkill) {
				return mapSkill(randItem(restoreSkills), this.being, allies, enemies);
			}

			return mapItem(randItem(restoreItems), this.being, allies);
		} else if (intent === effectKinds.buff) {
			let useSkill = buffSkills.length > 0;
			const useItem = buffItems.length > 0;
			if (useSkill && useItem) {
				useSkill = randItem([true, false]);
			}

			if (useSkill) {
				return mapSkill(randItem(buffSkills), this.being, allies, enemies);
			}

			return mapItem(randItem(buffItems), this.being, allies);
		} else if (intent === effectKinds.debuff) {
			return mapSkill(randItem(debuffSkills), this.being, allies, enemies);
		}

		throw new Error(`unknown intent kind "${intent}"`);
	}
}
