import {minions, minionKinds, costCalculator} from "./minions";
import {upgrades, calculateMultipliers} from "./upgrades";
import {Being} from "./rpg/beings";
import {data, saveGame, loadGame, deleteGame} from "./save-data";
import {createGameHook} from "./game-hook";
import {logInfo} from "./log";
import {addToast} from "./use-toasts";

function calculateRates(data, multipliers) {
	return minionKinds.map((kind) => ({
		kind,
		amount: data.minions[kind] * minions[kind].baseRate * multipliers[kind],
	}));
}

const privates = {};
export const game = {
	data,
	save() {
		saveGame();
		logInfo("game saved");
		addToast({title: "Game saved"});
	},
	load() {
		const didLoad = loadGame();
		game.multipliers = calculateMultipliers(game.data.upgrades);
		privates.moneyRates = calculateRates(game.data, game.multipliers);
		for (const adventurer of game.data.adventurers) {
			game.adventurers.push(new Being(adventurer, game.data.inventory.items));
		}

		if (didLoad) {
			addToast({title: "Game loaded", desc: "welcome back!", ttl: 0});
		}
	},
	delete() {
		deleteGame();
	},
	cutGrass() {
		game.data.stats.grassClicks++;

		const base = game.multipliers.grass;
		let multiplier = 1;
		for (const kind of minionKinds) {
			const bonus = game.multipliers.clickBonus[kind];
			multiplier += game.data.minions[kind] * bonus;
		}

		const amount = base * multiplier;
		game.data.inventory.money += amount;
		game.data.stats.totalMoney += amount;
		game.data.stats.clickMoney += amount;
		return amount;
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
				privates.moneyRates = calculateRates(game.data, game.multipliers);
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
			privates.moneyRates = calculateRates(game.data, game.multipliers);
		}
	},
	// getters
	get moneyRates() {return privates.moneyRates;},
};

game.useEncounter = createGameHook(game, "encounter", null);

// load game
game.load();
