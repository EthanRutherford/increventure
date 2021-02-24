const minionDefs = {
	grass: {
		name: "Grass",
		desc: "Hire an intern",
		baseCost: 10,
		baseRate: .1,
		unlock: (game) => game.stats.grassClicks > 5,
	},
	slime: {
		name: "Slime",
		desc: "Hire a slime",
		baseCost: 100,
		baseRate: 1,
		unlock: (game) => game.clearedDungeons.slime,
	},
	skeleton: {
		name: "Skeleton",
		desc: "Hire a skeleton",
		baseCost: 1000,
		baseRate: 8,
		unlock: (game) => game.clearedDungeons.skeleton,
	},
	goblin: {
		name: "Goblin",
		desc: "Hire a goblin",
		baseCost: 10000,
		baseRate: 64,
		unlock: (game) => game.clearedDungeons.goblin,
	},
};

export const minionKinds = Object.keys(minionDefs);

export class Minion {
	constructor(kind, count) {
		this.kind = kind;
		const def = minionDefs[kind];
		this.name = def.name;
		this.desc = def.desc;
		this.count = count;
		this.unlock = def.unlock;
	}
	get cost() {
		const def = minionDefs[this.kind];
		return Math.round(def.baseCost * (1.15 ** this.count));
	}
	computeRate(multipliers) {
		const def = minionDefs[this.kind];
		return this.count * def.baseRate * multipliers[this.kind];
	}
}
