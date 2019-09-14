const {randItem} = require("../util");

/*
	ai will likely evolve over development, but the base idea is
	to have a few "personalities" which assign different likelihoods for
	the various behaviors. For example, an "aggressive" ai will use
	offensive skills as frequently as available, and prefer attacking when
	out of mana. A "docile" ai will be more reserved, preferring to use defensive
	skills, or a "cooperative" ai will be more likely to give buffs to allies.

	The AI class is then a generalized controller, which follows basic decision
	making patterns using the weights from the personality along with the
	attributes and skills of the controlled being to produce an action to perform.
*/

class AI {
	constructor(being, personality) {
		this.being = being;
		this.personality = personality;
	}
	decide(allies, enemies) {
		// for the first iteration, the decision tree is essentially
		// just "pick a skill if you've got mp, else attack"

		const {useSkill, attack} = this.personality;
		const total = useSkill + attack;
		const decisionValue = Math.random() * total;

		if (this.being.skills.length && decisionValue < useSkill) {
			const skill = this.being.skills.find((skill) =>
				skill.mpCost(this.being) <= this.being.mp,
			);

			if (skill != null) {
				let target;
				if (skill.target === "enemy") {
					target = randItem(enemies);
				} else if (skill.target === "ally") {
					target = randItem([...allies, this.being]);
				} // else null; target is either self, all allies, or all enemies

				return {action: "skill", skill, target};
			}
		}

		return {action: "attack", target: randItem(enemies)};
	}
}

// personalities are collections of decision weights
const personalities = {
	aggressive: {
		useSkill: 10,
		attack: 1,
	},
	docile: {
		useSkill: 1,
		attack: 10,
	},
	// more to come...
	// cooperative, timid, stalwart, etc.
};

module.exports = {
	AI,
	personalities,
};
