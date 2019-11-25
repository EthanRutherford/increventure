export const upgrades = {
	scissors: {
		name: "Safety Scissors",
		desc: "Cutting grass is easier with something to cut with",
		cost: 100,
		getDeps: (data) => [data.minions.grass],
		unlock: (data) => data.minions.grass >= 1,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	shears: {
		name: "Garden Shears",
		desc: "Basically these are just really big scissors",
		cost: 1000,
		getDeps: (data) => [data.upgrades.scissors, data.stats.grassClicks],
		unlock: (data) => data.upgrades.scissors && data.stats.grassClicks >= 100,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	scythes: {
		name: "Scythes",
		desc: "Congrats! You've learned to use an actual grass cutting tool!",
		cost: 10000,
		getDeps: (data) => [data.upgrades.shears, data.stats.grassClicks],
		unlock: (data) => data.upgrades.shears && data.stats.grassClicks >= 1000,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	slimeCandy: {
		name: "Slime Candy",
		desc: "It sounds gross, but slimes love this stuff",
		cost: 1000,
		getDeps: (data) => [data.minions.slime],
		unlock: (data) => data.minions.slime >= 1,
		effect: (multipliers) => multipliers.slime *= 2,
	},
	slimeRancher: {
		name: "Slime Rancher",
		desc: "Your slime will help by disolving grass",
		cost: 2000,
		getDeps: (data) => [data.minions.slime],
		unlock: (data) => data.minions.slime >= 15,
		effect: (multipliers) => multipliers.clickBonus.slime += .1,
	},
	gotMilk: {
		name: "Got Milk?",
		desc: "Milk makes bones strong!",
		cost: 10000,
		getDeps: (data) => [data.minions.skeleton],
		unlock: (data) => data.minions.skeleton >= 1,
		effect: (multipliers) => multipliers.skeleton *= 2,
	},
	skeletonMowers: {
		name: "Skeleton lawn mowers",
		desc: "Your skeletons will help cut grass",
		cost: 20000,
		getDeps: (data) => [data.minions.skeleton],
		unlock: (data) => data.minions.skeleton >= 15,
		effect: (multipliers) => multipliers.clickBonus.skeleton += .1,
	},
};

export const upgradeIds = Object.keys(upgrades);

for (const id of upgradeIds) {
	const upgrade = upgrades[id];
	const getDeps = upgrade.getDeps;
	upgrade.getDeps = (data) => {
		const deps = getDeps(data);
		deps.push(data.upgrades[id]);
		return deps;
	};
}

export function calculateMultipliers(savedUpgrades) {
	const base = {
		clickBonus: {
			grass: 0,
			slime: 0,
			skeleton: 0,
		},
		grass: 1,
		slime: 1,
		skeleton: 1,
	};

	for (const [id, owned] of Object.entries(savedUpgrades)) {
		if (owned) {
			upgrades[id].effect(base);
		}
	}

	return base;
}
