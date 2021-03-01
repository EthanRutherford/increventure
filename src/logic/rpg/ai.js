import {randItem, WeightedSet} from "../util";
import {effectKinds, targetKinds, mapTarget} from "./effects";
import {actionKinds} from "./actions";
import {itemDefs} from "./items";

// personalities are collections of effect weights
// for pseudo-balance, the weights should total to 25
export const personalities = {
	neutral: {
		damage: 5,
		restore: 5,
		buff: 5,
		debuff: 5,
		drain: 5,
	},
	aggressive: {
		damage: 10,
		restore: 3,
		buff: 2,
		debuff: 6,
		drain: 4,
	},
	supportive: {
		damage: 3,
		restore: 10,
		buff: 6,
		debuff: 2,
		drain: 4,
	},
};

function getRestoreFactor(ratio) {
	// "should restore" factor starts at 0 when stat is full,
	// and reaches 1 when stat is reduced by two thirds. Being more than
	// two thirds empty (less than one third full) increases the factor further
	const twoThirds = 2 / 3;
	return (1 - ratio) / twoThirds;
}

function getRestoreData(self, allies) {
	// compute meta-info necessary for deciding whether to consider restorative actions
	// (unlike most actions, there are "dumb" times to use restorative actions, as
	// opposed to, say, buffing or damaging, which are virtually never unreasonable choices)
	const selfRestoreFactors = {
		target: self,
		hp: getRestoreFactor(self.hp / self.maxHp),
		mp: getRestoreFactor(self.mp / self.maxMp),
	};
	const allyRestoreFactors = [selfRestoreFactors];
	for (const ally of allies) {
		allyRestoreFactors.push({
			target: ally,
			hp: getRestoreFactor(ally.hp / ally.maxHp),
			mp: getRestoreFactor(ally.mp / ally.maxMp),
		});
	}

	// for ally/allies targetted skills, use ally that needs restore the most
	const bestChoiceHp = allyRestoreFactors.reduce((b, c) => c.hp > b.hp ? c : b, {hp: -1});
	const bestChoiceMp = allyRestoreFactors.reduce((b, c) => c.mp > b.mp ? c : b, {mp: -1});

	return {
		self: selfRestoreFactors,
		bestChoice: {
			hp: {target: bestChoiceHp.target, factor: bestChoiceHp.hp},
			mp: {target: bestChoiceMp.target, factor: bestChoiceMp.mp},
		},
	};
}

function evaluateRestoreOption(target, stat, restoreData, self, allies) {
	const targets = [];
	let factor = 0;
	if (target === targetKinds.self) {
		targets.push(restoreData.self.target);
		factor = restoreData.self[stat];
	} else if (target === targetKinds.ally) {
		const bestChoice = restoreData.bestChoice[stat];
		targets.push(bestChoice.target);
		factor = bestChoice.factor;
	} else if (target === targetKinds.allies) {
		targets.push(self, ...allies);
		factor = restoreData.bestChoice[stat].factor;
	}

	return {targets, factor};
}

// AI uses a personality to control a being
export class AI {
	constructor(being, personality) {
		this.being = being;
		this.personality = personality;
	}
	decide(allies, enemies) {
		// TODO? possible future exploration:
		// ai controlled beings should be pretty good at deciding when to use restorative actions
		// however, for all other action kinds, once the action *kind* has been chosen,
		// an action is chosen randomly, with no weights. For instance, there is no strategy
		// behind whether to use a damage skill, or a plain attack, nor which target to use
		// a buff/debuff skill on. However, this may be "good enough" to meet the goal of AI
		// in this game. The ai should seem reasonably strategic without being completely
		// predictable, so as long as they don't do dumb things like heal while already
		// at full health, and use skills when available (but not *constantly*), the illusion
		// of strategy may be sufficient as-is. Playtesting should reveal if further
		// tweaking this code is necessary.

		// sort out available skills and items
		const damageSkills = [];
		const restoreSkills = [];
		const buffSkills = [];
		const debuffSkills = [];
		const drainSkills = [];
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
			} else if (skill.kind === effectKinds.drain) {
				drainSkills.push(skill);
			}
		}

		const restoreItems = [];
		const buffItems = [];
		for (const [itemId, itemCount] of Object.entries(this.being.items)) {
			if (itemCount === 0) {
				continue;
			}

			const item = itemDefs[itemId];
			if (item.kind === effectKinds.restore) {
				restoreItems.push(itemId);
			} else if (item.kind === effectKinds.buff) {
				buffItems.push(itemId);
			}
		}

		// build weighted set of possible actions
		const intents = new WeightedSet();

		// process all the damage options
		const damageOptions = [];
		for (const skill of damageSkills) {
			const {options, all} = mapTarget(skill.target, self, allies, enemies);
			const targets = all ? options : [randItem(options)];
			damageOptions.push({kind: actionKinds.skill, skill, targets});
		}

		// a being can *always* just attack, so this is always in the set
		intents.set(effectKinds.damage, this.personality.damage);

		// process restorative skills and items
		// these are a little interesting, we only keep the most useful option
		let restoreFactor = .1;
		let restoreOption = null;
		const restoreData = getRestoreData(this.being, allies);
		for (const skill of restoreSkills) {
			const {targets, factor} = evaluateRestoreOption(
				skill.target, skill.stat, restoreData, this.being, allies,
			);

			if (factor > restoreFactor) {
				restoreOption = {kind: actionKinds.skill, skill, targets};
				restoreFactor = factor;
			}
		}

		for (const itemId of restoreItems) {
			const item = itemDefs[itemId];
			const {targets, factor} = evaluateRestoreOption(
				item.target, item.stat, restoreData, this.being, allies,
			);

			if (factor > restoreFactor) {
				restoreOption = {kind: actionKinds.item, itemId, targets};
				restoreFactor = factor;
			}
		}

		if (restoreOption != null) {
			intents.set(effectKinds.restore, this.personality.restore * restoreFactor);
		}

		// process buff skills and items
		const buffOptions = [];
		for (const skill of buffSkills) {
			const {options, all} = mapTarget(skill.target, self, allies, enemies);
			const targets = all ? options : [randItem(options)];
			buffOptions.push({kind: actionKinds.skill, skill, targets});
		}

		for (const itemId of buffItems) {
			const item = itemDefs[itemId];
			const {options, all} = mapTarget(item.target, self, allies, enemies);
			const targets = all ? options : [randItem(options)];
			buffOptions.push({kind: actionKinds.item, itemId, targets});
		}

		if (buffOptions.length > 0) {
			intents.set(effectKinds.buff, this.personality.buff);
		}

		// process debuff skills
		const debuffOptions = [];
		for (const skill of debuffSkills) {
			const {options, all} = mapTarget(skill.target, self, allies, enemies);
			const targets = all ? options : [randItem(options)];
			debuffOptions.push({kind: actionKinds.skill, skill, targets});
		}

		if (debuffOptions.length > 0) {
			intents.set(effectKinds.debuff, this.personality.debuff);
		}

		// process drain skills
		const drainOptions = [];
		for (const skill of drainSkills) {
			const {options, all} = mapTarget(skill.target, self, allies, enemies);
			const targets = all ? options : [randItem(options)];
			drainOptions.push({kind: actionKinds.skill, skill, targets});
		}

		if (drainOptions.length > 0) {
			intents.set(effectKinds.drain, this.personality.drain);
		}

		const intent = intents.getRand();
		if (intent === effectKinds.damage) {
			if (damageSkills.length > 0 && randItem([true, false])) {
				return randItem(damageOptions);
			}

			return {kind: actionKinds.attack, targets: [randItem(enemies)]};
		} else if (intent === effectKinds.restore) {
			return restoreOption;
		} else if (intent === effectKinds.buff) {
			return randItem(buffOptions);
		} else if (intent === effectKinds.debuff) {
			return randItem(debuffOptions);
		} else if (intent === effectKinds.drain) {
			return randItem(drainOptions);
		}

		throw new Error(`unknown intent kind "${intent}"`);
	}
}
