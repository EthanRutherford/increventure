export const targetKinds = {
	self: "self",
	ally: "ally",
	allies: "allies",
	enemy: "enemy",
	enemies: "enemies",
};

export const effectKinds = {
	damage: "damage",
	restore: "restore",
	buff: "buff",
	debuff: "debuff",
};

export const statKinds = {
	hp: "hp",
	mp: "mp",
	xp: "xp",
	str: "str",
	dex: "dex",
	con: "con",
	int: "int",
	wis: "wis",
	luck: "luck",
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
