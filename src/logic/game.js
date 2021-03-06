import {minionKinds, Minion} from "./minions";
import {upgradeIds, calculateMultipliers, Upgrade} from "./upgrades";
import {loadAdventurer} from "./rpg/beings";
import {saveGame, loadGame, deleteGame} from "./save-data";
import {logInfo} from "./log";
import {addToast} from "./use-toasts";
import {Dungeon, dungeonDefs} from "./dungeons/dungeon";
import {itemDefs, ItemCollection} from "./rpg/items";

function calculateRates(minions, multipliers) {
	return minionKinds.map((kind) => ({
		kind: kind,
		amount: minions[kind].computeRate(multipliers),
	}));
}

export const game = {
	save() {
		if (game.dungeon != null) {
			addToast({
				title: "Save Prohibited",
				desc: "saving the game is disabled while in a dungeon",
			});

			return;
		}

		const saveData = {
			adventurers: game.adventurers.map((adventurer) => adventurer.data),
			inventory: game.inventory,
			clearedDungeons: game.clearedDungeons,
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
		game.inventory.items = new ItemCollection(game.inventory.items);
		game.clearedDungeons = data.clearedDungeons;
		game.stats = data.stats;

		for (const adventurer of data.adventurers) {
			game.adventurers.push(loadAdventurer(adventurer, game.inventory.items));
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
			addToast({title: "Game loaded", desc: "welcome back!", ttl: 10000});
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
	// items
	buyItem(itemId) {
		const item = itemDefs[itemId];
		if (game.inventory.money >= item.cost && game.inventory.items[itemId] < item.max) {
			game.inventory.money -= item.cost;
			game.inventory.items[itemId]++;
		}
	},
	// dungeons
	dungeon: null,
	enterDungeon(kind) {
		const dungeonDef = dungeonDefs[kind];
		if (game.inventory.money >= dungeonDef.cost && game.dungeon == null) {
			game.inventory.money -= dungeonDef.cost;
			game.dungeon = new Dungeon(dungeonDef, (victory) => {
				game.dungeon = null;
				if (victory) {
					game.clearedDungeons[kind] = true;
				} else {
					for (const adventurer of game.adventurers) {
						if (adventurer.hp === 0) {
							adventurer.hp = 1;
						}
					}
				}
			});
		}
	},
};

// load game
game.load();
