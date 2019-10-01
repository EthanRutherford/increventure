import {stats, skills} from "./class-data";

export class Being {
	constructor(data) {
		this.data = data;
	}
	get name() {
		return this.data.name;
	}
	get class() {
		return this.data.kind;
	}
	get hp() {
		return this.data.hp;
	}
	set hp(hp) {
		this.data.hp = Math.max(0, Math.min(this.maxHp, hp));
	}
	get maxHp() {
		return this.data.con * this.lvl * 20;
	}
	get mp() {
		return this.data.mp;
	}
	set mp(mp) {
		this.data.mp = Math.max(0, Math.min(this.maxMp, mp));
	}
	get maxMp() {
		return this.data.int * this.lvl * 10;
	}
	get attack() {
		return this.data.str * this.lvl;
	}
	get critChance() {
		return this.data.dex * .01 + this.luckBonus;
	}
	get luckBonus() {
		return this.data.luck * .005;
	}
	get expRate() {
		return 1 + (this.data.wis * .02);
	}
	get lvl() {
		return Math.max(1, Math.floor(Math.log2(this.data.exp / 100)) + 2);
	}
	get skills() {
		const lvl = this.lvl;
		return skills[this.data.kind].filter((skill) => lvl >= skill.lvl);
	}
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

export function createNewAdventurer(name, kind) {
	const adventurer = new Being({...stats[kind]});
	adventurer.data.exp = 0;
	adventurer.data.name = name;
	adventurer.data.kind = kind;
	adventurer.data.hp = adventurer.maxHp;
	adventurer.data.mp = adventurer.maxMp;
	adventurer.data.created = true;
	return adventurer;
}

export function createNewMonster(name, kind) {
	const monster = new Being({...stats[kind]});
	monster.data.exp = 0;
	monster.data.name = name;
	monster.data.kind = kind;
	monster.data.hp = monster.maxHp;
	monster.data.mp = monster.maxMp;
	return monster;
}
