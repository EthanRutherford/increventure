export const minions = {
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
};

export const minionKinds = Object.keys(minions);

function calculateCost(base, count) {
	return Math.round(base * (1.15 ** count));
}

export const costCalculator = Object.entries(minions).reduce((obj, [kind, data]) => {
	obj[kind] = (count) => calculateCost(data.baseCost, count);
	return obj;
}, {});
