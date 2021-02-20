import {itemIds} from "./rpg/items";
import {minionKinds} from "./minions";
import {upgradeIds} from "./upgrades";
import {dungeonKinds} from "./dungeons/dungeon";

// initial saveData state
const getInitialData = () => ({
	adventurers: [],
	inventory: {
		money: 0,
		items: itemIds.reduce((obj, id) => {
			obj[id] = 0;
			return obj;
		}, {}),
	},
	clearedDungeons: dungeonKinds.reduce((obj, kind) => {
		obj[kind] = false;
		return obj;
	}, {}),
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
});

export function saveGame(data) {
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
	const data = getInitialData();
	loadInto(data, JSON.parse(savedData));
	return [savedData != null, data];
}

export function deleteGame() {
	localStorage.removeItem("saveGame");
	location.reload();
}
