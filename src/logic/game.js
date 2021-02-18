import {minionKinds, Minion} from "./minions";
import {upgradeIds, calculateMultipliers, Upgrade} from "./upgrades";
import {Being} from "./rpg/beings";
import {saveGame, loadGame, deleteGame} from "./save-data";
import {logInfo} from "./log";
import {addToast} from "./use-toasts";

function calculateRates(minions, multipliers) {
	return minionKinds.map((kind) => ({
		kind: kind,
		amount: minions[kind].computeRate(multipliers),
	}));
}

export const game = {
	save() {
		const saveData = {
			adventurers: game.adventurers.map((adventurer) => adventurer.data),
			inventory: game.inventory,
			minions: minionKinds.reduce((map, kind) => {
				map[kind] = game.minions[kind].count;
				return map;
			}, {}),
			upgrades: upgradeIds.reduce((map, id) => {
				map[id] = game.upgrades[id].owned;
				return map;
			}, {}),
			stats: game.stats,
		};

		saveGame(saveData);
		logInfo("game saved");
		addToast({title: "Game saved"});
	},
	load() {
		const [didLoad, data] = loadGame();
		game.inventory = data.inventory;
		game.stats = data.stats;

		for (const adventurer of data.adventurers) {
			game.adventurers.push(new Being(adventurer, game.inventory.items));
		}

		for (const kind of minionKinds) {
			game.minions[kind] = new Minion(kind, data.minions[kind]);
		}

		for (const id of upgradeIds) {
			game.upgrades[id] = new Upgrade(id, data.upgrades[id]);
		}

		game.multipliers = calculateMultipliers(game.upgrades);
		game.moneyRates = calculateRates(game.minions, game.multipliers);

		if (didLoad) {
			addToast({title: "Game loaded", desc: "welcome back!", ttl: 0});
		}
	},
	delete() {
		deleteGame();
	},
	cutGrass() {
		game.stats.grassClicks++;

		const base = game.multipliers.grass;
		let multiplier = 1;
		for (const kind of minionKinds) {
			const bonus = game.multipliers.clickBonus[kind];
			multiplier += game.minions[kind].count * bonus;
		}

		const amount = base * multiplier;
		game.inventory.money += amount;
		game.stats.totalMoney += amount;
		game.stats.clickMoney += amount;
		return amount;
	},
	// adventurers
	adventurers: [],
	// minions
	minions: {},
	buyMinion(minion) {
		if (game.inventory.money >= minion.cost) {
			game.inventory.money -= minion.cost;
			minion.count++;
			game.moneyRates = calculateRates(game.minions, game.multipliers);
		}
	},
	// upgrades
	upgrades: {},
	buyUpgrade(upgrade) {
		if (game.inventory.money >= upgrade.cost && !upgrade.owned) {
			game.inventory.money -= upgrade.cost;
			upgrade.owned = true;
			game.multipliers = calculateMultipliers(game.upgrades);
			game.moneyRates = calculateRates(game.minions, game.multipliers);
		}
	},
};

// load game
game.load();
