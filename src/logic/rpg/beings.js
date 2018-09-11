const {stats, skills} = require("./class-data");

class Being {
	constructor(data) {
		this.data = data;
	}
	get name() {
		return this.data.name;
	}
	get maxHp() {
		return this.data.con * this.lvl * 20;
	}
	get maxMp() {
		return this.data.int * this.lvl * 10;
	}
	get attack() {
		return this.data.str * this.lvl;
	}
	get dexRate() {
		return 1 + (this.data * .01);
	}
	get expRate() {
		return 1 + (this.data.wis * .02);
	}
	get lvl() {
		return Math.max(1, Math.floor(Math.log2(this.data.exp / 100)) + 2);
	}
	get skills() {
		const lvl = this.lvl;
		return skills[this.kind].filter((skill) => lvl >= skill.lvl);
	}
}

const adventurers = {
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

const monsters = {
	slime: {
		name: "Slime",
		desc: "",
	},
};

function createNewAdventurer(data, name, kind) {
	const adventurer = new Being(Object.assign(data, stats[kind]));
	adventurer.data.name = name;
	adventurer.data.kind = kind;
	adventurer.data.hp = adventurer.maxHp;
	adventurer.data.mp = adventurer.maxMp;
	adventurer.data.exp = 0;
	adventurer.data.created = true;
	return new Being(data);
}

module.exports = {
	Being,
	adventurers,
	adventurerKinds: Object.keys(adventurers),
	monsters,
	monsterKinds: Object.keys(monsters),
	createNewAdventurer,
};
