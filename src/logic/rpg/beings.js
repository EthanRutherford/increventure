import {statKinds} from "./effects";
import {stats, skills} from "./class-data";

export class Being {
	constructor(data, items) {
		this.data = data;
		this.items = items;
		this.buffs = new Set();
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
	set hp(hp) {
		this.data.hp = Math.max(0, Math.min(this.maxHp, hp));
	}
	get maxHp() {
		return this.con * this.lvl * 20;
	}
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
	get expRate() {
		return 1 + (this.wis * .02);
	}
	get lvl() {
		return Math.max(1, Math.floor(Math.log2(this.xp / 100)) + 2);
	}
	get skills() {
		const lvl = this.lvl;
		return skills[this.data.kind].filter((skill) => lvl >= skill.lvl);
	}
	get image() {
		return this.data.image;
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

export const adventurers = {
	hero: {
		name: "Hero",
		desc: "A well-rounded adventurer that can handle most any situation",
	},
	warrior: {
		name: "Warrior",
		desc: "A brutish adventurer keen on smashing skulls and making mad gainz",
	},
	wizard: {
		name: "Wizard",
		desc: "An adventurer skilled in the arcane arts, but lacking in athleticism",
	},
	cleric: {
		name: "Cleric",
		desc: "A helpful adventurer, dedicated to keeping the party in top condition",
	},
	prodigy: {
		name: "Prodigy",
		desc: "The most clever adventurer learns quickly, despite their young age",
	},
	savant: {
		name: "Savant",
		desc: "An adventurer of incredible skill, but low aptitude for learning new tricks",
	},
};

export const adventurerKinds = Object.keys(adventurers);

export const monsters = {
	// ideas for futher monsters (which have corresponding dungeons/minions)
	// in no particular order yet (in fact, might allow user to decide order):
	// skeletons - nyeh!
	// golems - perhaps even of more than one type
	// drakes - small dragons yeh
	// necromancers - can summon skellies
	// chimera - cockatrice, manticore, etc. (maybe)
	slime: {
		name: "Slime",
		desc: "",
	},
	skeleton: {
		name: "Skeleton",
		desc: "",
	},
};

export const monsterKinds = Object.keys(monsters);

export function createNewAdventurer(name, kind, items) {
	const adventurer = new Being({...stats[kind]}, items);
	adventurer.data.xp = 0;
	adventurer.data.name = name;
	adventurer.data.kind = kind;
	adventurer.data.hp = adventurer.maxHp;
	adventurer.data.mp = adventurer.maxMp;
	return adventurer;
}

export function createNewMonster(name, kind, xp, items = {}) {
	const monster = new Being({...stats[kind]}, items);
	monster.data.xp = xp;
	monster.data.name = name;
	monster.data.kind = kind;
	monster.data.hp = monster.maxHp;
	monster.data.mp = monster.maxMp;
	return monster;
}

export function levelToXp(lvl) {
	return (2 ** (lvl - 2)) * 100;
}
