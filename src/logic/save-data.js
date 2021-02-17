import {itemIds} from "./rpg/items";
import {minionKinds} from "./minions";
import {upgradeIds} from "./upgrades";

// initial saveData state
export const data = {
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

export function saveGame() {
	localStorage.setItem("saveGame", JSON.stringify(data));
}

function loadInto(target, source) {
	if (source == null) {
		return;
	}

	if (target instanceof Array) {
		for (let i = 0; i < source.length; i++) {
			if (i < target.length && typeof target[i] === "object") {
				loadInto(target[i], source[i]);
			} else {
				target[i] = source[i];
			}
		}
	} else {
		for (const key of Object.keys(target)) {
			if (source[key] == null) {
				continue;
			} else if (typeof target[key] === "object") {
				loadInto(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}
}

export function loadGame() {
	const savedData = localStorage.getItem("saveGame");
	loadInto(data, JSON.parse(savedData));

	return savedData != null;
}

export function deleteGame() {
	localStorage.removeItem("saveGame");
	location.reload();
}
