const {minions, minionKinds, costCalculator} = require("./minions");
const {upgrades, calculateMultipliers} = require("./upgrades");
const {Being} = require("./rpg/beings");
const {data, watch, saveGame, loadGame} = require("./save-data");

const game = {
	data,
	watch,
	save() {
		saveGame();
	},
	load() {
		loadGame();
		game.multipliers = calculateMultipliers(game.data.upgrades);
		if (game.data.adventurer1) {
			game.adventurers.adventurer1 = new Being(game.data.adventurer1);
		}
		if (game.data.adventurer2) {
			game.adventurers.adventurer2 = new Being(game.data.adventurer2);
		}
		if (game.data.adventurer3) {
			game.adventurers.adventurer3 = new Being(game.data.adventurer3);
		}
		if (game.data.adventurer4) {
			game.adventurers.adventurer4 = new Being(game.data.adventurer4);
		}
	},
	cutGrass() {
		game.data.stats.grassClicks++;
		game.data.inventory.money += game.multipliers.grass;
	},
	// minion data
	minionCosts: minionKinds.reduce((obj, kind) => {
		Object.defineProperty(obj, kind, {
			get: () => costCalculator[kind](game.data.minions[kind]),
		});
		return obj;
	}, {}),
	buyMinion: minionKinds.reduce((obj, kind) => {
		obj[kind] = () => {
			if (game.data.inventory.money >= game.minionCosts[kind]) {
				game.data.inventory.money -= game.minionCosts[kind];
				game.data.minions[kind]++;
			}
		};
		return obj;
	}, {}),
	// adventurers
	adventurers: {},
	// upgrades
	buyUpgrade(upgradeId) {
		if (game.data.inventory.money >= upgrades[upgradeId].cost) {
			game.data.inventory.money -= upgrades[upgradeId].cost;
			game.data.upgrades[upgradeId] = true;
			game.multipliers = calculateMultipliers(game.data.upgrades);
		}
	},
};

// main logic loop
let lastTick = performance.now();
setInterval(function() {
	// timing logic
	const thisTick = performance.now();
	const diff = (thisTick - lastTick) / 1000;
	lastTick = thisTick;

	// minion logic
	for (const kind of minionKinds) {
		if (game.data.minions[kind]) {
			const base = minions[kind].baseRate;
			const count = game.data.minions[kind];
			const mult = game.multipliers[kind];
			game.data.inventory.money += base * count * mult * diff;
		}
	}

	// stats tracking
	if (game.data.inventory.money > game.data.stats.mostMoney) {
		game.data.stats.mostMoney = game.data.money;
	}
}, 50);

// load game
game.load();
module.exports = game;
