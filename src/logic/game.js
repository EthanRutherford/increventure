const {useState} = require("react");
const {minionKinds, costCalculator} = require("./minions");
const {upgrades, calculateMultipliers} = require("./upgrades");
const {Being} = require("./rpg/beings");
const {data, saveGame, loadGame} = require("./save-data");

const game = {
	data,
	save() {
		saveGame();
	},
	load() {
		loadGame();
		game.multipliers = calculateMultipliers(game.data.upgrades);
		for (const adventurer of game.data.adventurers) {
			game.adventurers.push(new Being(adventurer));
		}
	},
	cutGrass() {
		game.data.stats.grassClicks++;

		const base = game.multipliers.grass;
		let multiplier = 0;
		for (const bonus of game.multipliers.clickBonus) {
			multiplier += bonus(game.data);
		}

		game.data.inventory.money += base * multiplier;
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
	adventurers: [],
	// upgrades
	buyUpgrade(upgradeId) {
		if (game.data.inventory.money >= upgrades[upgradeId].cost) {
			game.data.inventory.money -= upgrades[upgradeId].cost;
			game.data.upgrades[upgradeId] = true;
			game.multipliers = calculateMultipliers(game.data.upgrades);
		}
	},
	// encounter hook, only to be used by combatUI
	useEncounter() {
		const [encounter, setEncounter] = useState(null);
		game.encounter = encounter;
		game.setEncounter = setEncounter;
	},
};

// load game
game.load();
module.exports = game;
