const skills = require("./skills");

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
		str: 3,
		dex: 3,
		con: 3,
		int: 3,
		wis: 3,
		luck: 1,
	},
	warrior: {
		str: 4,
		dex: 3,
		con: 5,
		int: 1,
		wis: 2,
		luck: 1,
	},
	wizard: {
		str: 1,
		dex: 2,
		con: 2,
		int: 6,
		wis: 4,
		luck: 1,
	},
	cleric: {
		str: 2,
		dex: 1,
		con: 3,
		int: 4,
		wis: 5,
		luck: 1,
	},
	prodigy: {
		str: 1,
		dex: 1,
		con: 1,
		int: 1,
		wis: 10,
		luck: 2,
	},
	savant: {
		str: 4,
		dex: 0,
		con: 3,
		int: 8,
		wis: 0,
		luck: 1,
	},
};

const monsters = {
	slime: {
		str: 1,
		dex: 1,
		con: 1,
		int: 1,
		wis: 1,
		luck: 1,
	},
};

function createNewAdventurer(data, name, kind) {
	const baseData = adventurers[kind];
	Object.assign(data, baseData);
	data.name = name;
	data.kind = kind;
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
