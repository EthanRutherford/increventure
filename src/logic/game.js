import {useState} from "react";
import {minions, minionKinds, costCalculator} from "./minions";
import {upgrades, calculateMultipliers} from "./upgrades";
import {Being} from "./rpg/beings";
import {data, saveGame, loadGame} from "./save-data";
import {logInfo} from "./log";


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
	},
	load() {
		loadGame();
		game.multipliers = calculateMultipliers(game.data.upgrades);
		privates.moneyRate = calculateRate(game.data, game.multipliers);
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
	// encounter hook, only to be used by combatUI
	useEncounter() {
		const [encounter, setEncounter] = useState(null);
		game.encounter = encounter;
		game.setEncounter = setEncounter;
	},
};

// load game
game.load();
