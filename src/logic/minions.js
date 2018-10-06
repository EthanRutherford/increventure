const minions = {
	grass: {
		name: "Grass",
		desc: "cuts grass for you",
		baseCost: 20,
		baseRate: .1,
	},
	slime: {
		name: "Slime",
		desc: "farms slimes for you",
		baseCost: 100,
		baseRate: 1,
	},
};

function calculateCost(base, count) {
	return Math.round(base * (1.15 ** count));
}

const costCalculator = Object.entries(minions).reduce((obj, [kind, data]) => {
	obj[kind] = (count) => calculateCost(data.baseCost, count);
	return obj;
}, {});

module.exports = {
	minions,
	minionKinds: Object.keys(minions),
	costCalculator,
};
