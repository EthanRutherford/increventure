const minionDefs = {
	grass: {
		name: "Grass",
		desc: "cuts grass for you",
		baseCost: 10,
		baseRate: .1,
		unlock: (game) => game.stats.grassClicks > 5,
	},
	slime: {
		name: "Slime",
		desc: "farms slimes for you",
		baseCost: 100,
		baseRate: 1,
		unlock: (game) => game.clearedDungeons.slime,
	},
	skeleton: {
		name: "Skeleton",
		desc: "farms skeletons for you",
		baseCost: 1000,
		baseRate: 8,
		unlock: (game) => game.clearedDungeons.skeleton,
	},
	goblin: {
		name: "Goblin",
		desc: "farms goblins for you",
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
