import {minions, minionKinds, costCalculator} from "./minions";
import {upgrades, calculateMultipliers} from "./upgrades";
import {Being} from "./rpg/beings";
import {data, saveGame, loadGame} from "./save-data";
import {createGameHook} from "./game-hook";
import {logInfo} from "./log";
import {addToast} from "./use-toasts";

function calculateRate(data, multipliers) {
	return minionKinds.reduce(
		(total, kind) => total + data.minions[kind] * minions[kind].baseRate * multipliers[kind],
		0,
	);
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
		privates.moneyRate = calculateRate(game.data, game.multipliers);
		for (const adventurer of game.data.adventurers) {
			game.adventurers.push(new Being(adventurer));
		}

		if (didLoad) {
			addToast({title: "Game loaded", desc: "welcome back!", ttl: 0});
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
				privates.moneyRate = calculateRate(game.data, game.multipliers);
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
			privates.moneyRate = calculateRate(game.data, game.multipliers);
		}
	},
	// getters
	get moneyRate() {return privates.moneyRate;},
};

game.useEncounter = createGameHook(game, "encounter", null);

// load game
game.load();
