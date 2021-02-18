const minionDefs = {
	grass: {
		name: "Grass",
		desc: "cuts grass for you",
		baseCost: 10,
		baseRate: .1,
	},
	slime: {
		name: "Slime",
		desc: "farms slimes for you",
		baseCost: 100,
		baseRate: 1,
	},
	skeleton: {
		name: "Skeleton",
		desc: "farms skeletons for you",
		baseCost: 1000,
		baseRate: 8,
	},
	goblin: {
		name: "Goblin",
		desc: "farms goblins for you",
		baseCost: 10000,
		baseRate: 64,
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
