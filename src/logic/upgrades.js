let nextId = 0;
function upgrade(obj) {
	obj.id = nextId++;
	return obj;
}

const upgradeList = [
	upgrade({
		name: "Safety Scissors",
		desc: "Cutting grass is easier with something to cut with.",
		cost: 100,
		unlock: (data) => data.minions.grass > 0,
		effect: (multipliers) => multipliers.grass *= 2,
	}),
];

const upgradeMap = upgradeList.reduce((map, upgrade) => {
	map[upgrade.id] = upgrade;
	return map;
}, {});

function calculateMultipliers(savedUpgrades) {
	const base = {
		grass: 1,
		slime: 1,
	};

	for (const [id, owned] of Object.entries(savedUpgrades)) {
		if (owned) {
			upgradeMap[id].effect(base);
		}
	}

	return base;
}

module.exports = {
	upgradeList,
	upgradeMap,
	calculateMultipliers,
};
