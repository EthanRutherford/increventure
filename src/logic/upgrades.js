const upgrades = {
	scissors: {
		name: "Safety Scissors",
		desc: "Cutting grass is easier with something to cut with.",
		cost: 100,
		unlock: (data) => data.minions.grass > 0,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	scythes: {
		name: "Scythes",
		desc: "Congrats! You've learned to use an actual grass cutting tool!",
		cost: 500,
		unlock: (data) => data.upgrades.scissors && data.stats.grassClicks > 1000,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	slimeCandy: {
		name: "Slime Candy",
		desc: "Attract more slimes with some slime candy",
		cost: 1000,
		unlock: (data) => data.minions.slime > 0,
		effect: (multipliers) => multipliers.slime *= 2,
	},
};

function calculateMultipliers(savedUpgrades) {
	const base = {
		grass: 1,
		slime: 1,
	};

	for (const [id, owned] of Object.entries(savedUpgrades)) {
		if (owned) {
			upgrades[id].effect(base);
		}
	}

	return base;
}

module.exports = {
	upgrades,
	upgradeIds: Object.keys(upgrades),
	calculateMultipliers,
};
