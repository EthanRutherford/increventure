import {adventurerDefs, monsterDefs} from "../classes/classes";
import {statKinds} from "./effects";

class Being {
	constructor(data, skills, items) {
		this.data = data;
		this.items = items;
		this.buffs = new Set();
		Object.defineProperty(this, "skills", {
			get() {
				const lvl = this.lvl;
				return skills.filter((skill) => lvl >= skill.lvl);
			},
		});
	}
	get name() {
		return this.data.name;
	}
	get kind() {
		return this.data.kind;
	}
	get class() {
		const className = this.data.kind.replace(/[A-Z]/g, (s) => " " + s);
		return className[0].toUpperCase() + className.substr(1);
	}
	get skinColor() {
		return this.data.skinColor;
	}
	// this is fine, the getter is defined below
	// eslint-disable-next-line accessor-pairs
	set hp(hp) {
		this.data.hp = Math.max(0, Math.min(this.maxHp, hp));
	}
	get maxHp() {
		return this.con * this.lvl * 10;
	}
	// this is fine, the getter is defined below
	// eslint-disable-next-line accessor-pairs
	set mp(mp) {
		this.data.mp = Math.max(0, Math.min(this.maxMp, mp));
	}
	get maxMp() {
		return this.int * this.lvl * 10;
	}
	get attack() {
		return this.str * this.lvl;
	}
	get dexChanceMod() {
		return this.dex * .01 + this.luckBonus;
	}
	get luckBonus() {
		return this.luck * .005;
	}
	get xpRate() {
		return 1 + (this.wis * .02);
	}
	get lvl() {
		return Math.max(1, Math.floor(Math.log2(this.xp / 50)) + 2);
	}
	gainXp(amount) {
		const prevLvl = this.lvl;
		this.data.xp += amount * this.xpRate;
		if (this.lvl > prevLvl) {
			this.hp = this.maxHp;
			return true;
		}

		return false;
	}
}

// this is a bit messy, but hey
for (const stat of Object.keys(statKinds)) {
	Object.defineProperty(Being.prototype, stat, {
		get() {
			let amount = this.data[stat];
			for (const buff of this.buffs) {
				if (buff.stat === stat) {
					amount += buff.amount;
				}
			}

			return amount;
		},
	});
}

// ideas for futher monsters (which have corresponding dungeons/minions)
// in no particular order
// golems - perhaps even of more than one type
// drakes - small dragons yeh
// necromancers - can summon skellies
// chimera - cockatrice, manticore, etc. (maybe)

export function createNewAdventurer(name, kind, skinColor, items) {
	const def = adventurerDefs[kind];
	const adventurer = new Being({
		name,
		kind,
		skinColor,
		xp: 0,
		...def.baseStats,
	}, def.skills, items);

	adventurer.hp = adventurer.maxHp;
	adventurer.mp = adventurer.maxMp;
	return adventurer;
}

export function loadAdventurer(data, items) {
	const def = adventurerDefs[data.kind];
	return new Being(data, def.skills, items);
}

export function createNewMonster(kind, xp, items = {}) {
	const def = monsterDefs[kind];
	const monster = new Being({
		name: def.createName(),
		kind,
		xp,
		...def.baseStats,
	}, def.skills, items);

	monster.hp = monster.maxHp;
	monster.mp = monster.maxMp;
	monster.image = def.image;
	monster.icon = def.image; // TODO: these will eventually be different
	monster.lootTable = def.lootTable;
	monster.xpMod = def.xpMod;
	return monster;
}

export function levelToXp(lvl) {
	return (2 ** (lvl - 2)) * 50;
}
