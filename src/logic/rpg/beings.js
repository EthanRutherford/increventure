const {stats, skills} = require("./class-data");

/*
	stats affect a character's abilities
	str: affects how much damage a character does
	dex: affects how likely a character is to do critical hits or avoid damage
	con: affects how much health a character has
	int: affects how much mana a character has
	wis: affects how quickly a character levels up
	luck: gives a small boost to all chance-based events
*/

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
	const baseData = stats[kind];
	Object.assign(data, baseData);
	data.name = name;
	data.kind = kind;
	data.created = true;
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
