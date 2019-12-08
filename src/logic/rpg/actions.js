export const actionKinds = {
	attack: "attack",
	skill: "skill",
};

export const targetKinds = {
	self: "self",
	ally: "ally",
	allies: "allies",
	enemy: "enemy",
	enemies: "enemies",
};

export const skillKinds = {
	damage: "damage",
	restore: "restore",
	buff: "buff",
};

export function mapTarget(targetKind, self, allies, enemies) {
	if (targetKind === targetKinds.self) {
		return {options: [self], all: false};
	}

	if (targetKind === targetKinds.ally) {
		return {options: [self, ...allies], all: false};
	}

	if (targetKind === targetKinds.allies) {
		return {options: [self, ...allies], all: true};
	}

	if (targetKind === targetKinds.enemy) {
		return {options: enemies, all: false};
	}

	if (targetKind === targetKinds.enemies) {
		return {options: enemies, all: true};
	}

	throw "this should not happen";
}

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

		if (action.skill.kind === skillKinds.damage) {
			for (const target of action.targets) {
				const effect = action.skill.effect(source);
				result.values.push(doDamage(source, target, effect.amount));
			}
		} else if (action.skill.kind === skillKinds.restore) {
			for (const target of action.targets) {
				const {stat, amount} = action.skill.effect(source);
				target[stat] += amount;
				result.values.push({target, stat, amount});
			}
		} else if (action.skill.kind === skillKinds.buff) {
			for (const target of action.targets) {
				const {stat, amount, turns} = action.skill.effect(source);
				target.buffs.add({stat, amount, turns});
				result.values.push({target, stat, amount});
			}
		}
	}

	return result;
}
