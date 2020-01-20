import {effectKinds} from "./effects";

export const actionKinds = {
	attack: "attack",
	skill: "skill",
	item: "item",
};

function doDamage(source, target, amount) {
	const mult = Math.random() < source.critChance ? 2 : 1;
	const damage = amount * mult;
	const dodged = Math.random() < target.critChance;

	if (!dodged) {
		target.hp -= damage;
	}

	return {
		target,
		dodged,
		damage: dodged ? 0 : damage,
	};
}

export function doAction(source, action) {
	const result = {source, kind: action.kind, values: []};
	if (action.kind === actionKinds.attack) {
		for (const target of action.targets) {
			result.values.push(doDamage(source, target, source.attack));
		}
	} else 	if (action.kind === actionKinds.skill) {
		source.mp -= action.skill.mpCost(source);
		result.skill = action.skill;

		if (action.skill.kind === effectKinds.damage) {
			for (const target of action.targets) {
				const {amount} = action.skill.effect(source);
				result.values.push(doDamage(source, target, amount));
			}
		} else if (action.skill.kind === effectKinds.restore) {
			for (const target of action.targets) {
				const {stat, effect} = action.skill;
				const {amount} = effect(source);
				target[stat] += amount;
				result.values.push({target, stat, amount});
			}
		} else if (action.skill.kind === effectKinds.buff) {
			for (const target of action.targets) {
				const {stat, effect} = action.skill;
				const {amount, turns} = effect(source);
				target.buffs.add({stat, amount, turns});
				result.values.push({target, stat, amount});
			}
		}
	}

	return result;
}
