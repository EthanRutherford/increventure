import {itemIds} from "./rpg/items";
import {minionKinds} from "./minions";
import {upgradeIds} from "./upgrades";

// initial saveData state
const initialData = {
	adventurers: [],
	inventory: {
		money: 0,
		items: itemIds.reduce((obj, id) => {
			obj[id] = 0;
			return obj;
		}, {}),
	},
	minions: minionKinds.reduce((obj, kind) => {
		obj[kind] = 0;
		return obj;
	}, {}),
	upgrades: upgradeIds.reduce((obj, upgradeId) => {
		obj[upgradeId] = false;
		return obj;
	}, {}),
	stats: {
		gameStarted: Date.now(),
		totalMoney: 0,
		mostMoney: 0,
		grassClicks: 0,
		clickMoney: 0,
		mouseDistance: 0,
		minionMoney: minionKinds.reduce((obj, kind) => {
			obj[kind] = 0;
			return obj;
		}, {}),
	},
};

export function saveGame(data) {
	localStorage.setItem("saveGame", JSON.stringify(data));
}

export function loadGame() {
	const savedData = localStorage.getItem("saveGame");
	if (savedData == null) {
		return [false, initialData];
	}

	return [true, JSON.parse(savedData)];
}

export function deleteGame() {
	localStorage.removeItem("saveGame");
	location.reload();
}
