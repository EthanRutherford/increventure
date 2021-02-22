import {effectKinds, statKinds} from "./effects";
import {items} from "./items";

export const actionKinds = {
	attack: "attack",
	skill: "skill",
	item: "item",
	run: "run",
};

function doDamage(source, target, amount) {
	const mult = Math.random() < source.dexChanceMod ? 2 : 1;
	const damage = amount * mult;
	const dodged = Math.random() < target.dexChanceMod;

	if (!dodged) {
		target.hp -= damage;
	}

	return {
		target,
		dodged,
		damage: dodged ? 0 : damage,
	};
}

function clampMaxAmount(target, stat, amount) {
	if (stat === statKinds.hp) {
		return Math.min(amount, target.maxHp - target.hp);
	}

	if (stat === statKinds.mp) {
		return Math.min(amount, target.maxMp - target.mp);
	}

	return amount;
}

export function doAction(source, action) {
	const result = {source, kind: action.kind, values: []};
	if (action.kind === actionKinds.attack) {
		for (const target of action.targets) {
			result.values.push(doDamage(source, target, source.attack));
		}
	} else if (action.kind === actionKinds.skill) {
		source.mp -= action.skill.mpCost(source);
		result.skill = action.skill;

		const effectKind = action.skill.kind;
		if (effectKind === effectKinds.damage) {
			for (const target of action.targets) {
				const {amount} = action.skill.effect(source);
				result.values.push(doDamage(source, target, amount));
			}
		} else if (effectKind === effectKinds.restore) {
			for (const target of action.targets) {
				const {stat, effect} = action.skill;
				const amount = clampMaxAmount(target, stat, effect(source).amount);
				target[stat] += amount;
				result.values.push({target, stat, amount});
			}
		} else if (effectKind === effectKinds.buff || effectKind === effectKinds.debuff) {
			const multiplier = effectKind === effectKinds.debuff ? -1 : 1;
			const {stats, effect} = action.skill;
			const result = effect(source);
			for (const target of action.targets) {
				for (const stat of stats) {
					const amount = result[stat] * multiplier;
					target.buffs.add({stat, amount, turns: result.turns});
					result.values.push({target, stat, amount});
				}
			}
		} else if (effectKind === effectKinds.drain) {
			const {stat, effect} = action.skill;
			const {amount} = effect(source);
			for (const target of action.targets) {
				const actualAmount = Math.min(amount, target[stat]);
				target[stat] -= actualAmount;
				result.values.push({target, stat, amount: actualAmount});
			}
		}
	} else if (action.kind === actionKinds.item) {
		const item = items[action.itemId];
		source.items[action.itemId]--;
		result.item = item;

		if (item.kind === effectKinds.restore) {
			for (const target of action.targets) {
				const {stat, effect} = item;
				const amount = clampMaxAmount(target, stat, effect(source).amount);
				target[stat] += amount;
				result.values.push({target, stat, amount});
			}
		} else if (item.kind === effectKinds.buff) {
			for (const target of action.targets) {
				const {stat, effect} = item;
				const {amount, turns} = effect(source);
				target.buffs.add({stat, amount, turns});
				result.values.push({target, stat, amount});
			}
		}
	} else if (action.kind === actionKinds.run) {
		const target = action.targets.reduce((cur, t) => {
			if (t.dexChanceMod > cur.dexChanceMod) {
				return t;
			}

			return cur;
		}, {dexChanceMod: 0});

		const chanceMod = 1 + source.dexChanceMod - target.dexChanceMod;
		const success = Math.random() < .6 * chanceMod;
		result.values.push({target, success});
	}

	return result;
}
