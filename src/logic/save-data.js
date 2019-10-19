import {useState, useEffect} from "react";
import {minionKinds} from "./minions";
import {upgradeIds} from "./upgrades";
import {throttle} from "./util";

// initial saveData state
const saveData = {
	adventurers: [],
	inventory: {
		money: 0,
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
		mostMoney: 0,
		grassClicks: 0,
	},
};

// queued updates
const listenerMap = {};
let timeout;
const queue = new Set();

function addListener(path, listener) {
	if (listenerMap[path] == null) {
		listenerMap[path] = new Set([listener]);
	} else {
		listenerMap[path].add(listener);
	}
}

function doUpdates() {
	const listeners = new Set();
	for (const update of queue) {
		for (const listener of listenerMap[update] || []) {
			listeners.add(listener);
		}
	}

	for (const listener of listeners) {
		listener();
	}

	queue.clear();
	timeout = null;
}

function proxify(data, path) {
	return new Proxy(data, {
		set(target, prop, value) {
			target[prop] = value;
			queue.add(`${path}.${prop}`);
			if (timeout == null) timeout = setTimeout(doUpdates, 0);
			return true;
		},
		get(target, prop) {
			const value = target[prop];
			return value && typeof value === "object" ?
				proxify(value, `${path}.${prop}`) :
				value
			;
		},
	});
}

const dummy = function() {};
const toggler = (x) => !x;
function keyMaker(array) {
	return new Proxy(dummy, {
		get(_, prop) {
			const prev = array[array.length - 1];
			return keyMaker([...array, `${prev}.${prop}`]);
		},
		apply() {
			return array;
		},
	});
}

function saveDataEffect(getWatched, updateMe) {
	const maker = keyMaker(["data"]);
	const result = getWatched == null ? maker : getWatched(maker);
	const proxies = result instanceof Array ? result : [result];
	const paths = proxies.map((x) => x());
	for (const path of paths) {
		for (const piece of path) {
			addListener(piece, updateMe);
		}
	}

	return () => {
		updateMe.cancel();
		for (const path of paths) {
			for (const piece of path) {
				listenerMap[piece].delete(updateMe);
			}
		}
	};
}

export const data = proxify(saveData, "data");

export function useSaveData(getWatched = null, throttleTime = 0) {
	const [, flipFlop] = useState(true);
	useEffect(() => {
		const updateMe = throttle(() => flipFlop(toggler), throttleTime);
		return saveDataEffect(getWatched, updateMe);
	}, []);
}

export function saveGame() {
	localStorage.setItem("saveGame", JSON.stringify(saveData));
}

export function loadGame() {
	const saveGame = JSON.parse(localStorage.getItem("saveGame")) || {};
	for (const key of Object.keys(saveGame)) {
		Object.assign(saveData[key], saveGame[key]);
	}
}
