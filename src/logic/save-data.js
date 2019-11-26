import {useRef, useEffect} from "react";
import {useUpdater} from "./util";
import {minionKinds} from "./minions";
import {upgradeIds} from "./upgrades";

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
		totalMoney: 0,
		mostMoney: 0,
		clickMoney: 0,
		minionMoney: minionKinds.reduce((obj, kind) => {
			obj[kind] = 0;
			return obj;
		}, {}),
		grassClicks: 0,
		mouseDistance: 0,
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

function proxify(data, array) {
	const prev = array[array.length - 1];
	return new Proxy(data, {
		set(target, prop, value) {
			target[prop] = value;
			for (const path of array) {
				queue.add(path);
			}
			queue.add(`${prev}.${prop}`);
			if (timeout == null) timeout = setTimeout(doUpdates, 0);
			return true;
		},
		get(target, prop) {
			const value = target[prop];
			return value && typeof value === "object" ?
				proxify(value, array.concat(`${prev}.${prop}`)) :
				value
			;
		},
	});
}

const dummy = function() {};
function keyMaker(path) {
	return new Proxy(dummy, {
		get(_, prop) {
			return keyMaker(`${path}.${prop}`);
		},
		apply() {
			return path;
		},
	});
}

function saveDataEffect(getWatched, updateMe) {
	const maker = keyMaker("data");
	const result = getWatched(maker);
	const proxies = result instanceof Array ? result : [result];
	const paths = proxies.map((x) => x());
	for (const path of paths) {
		addListener(path, updateMe);
	}

	return () => {
		for (const path of paths) {
			listenerMap[path].delete(updateMe);
		}
	};
}

export const data = proxify(saveData, ["data"]);

export function useSaveData(getWatched) {
	const updater = useUpdater();
	useEffect(() => saveDataEffect(getWatched, updater), []);
}

export function useDerivedData(getWatched, getDerived) {
	const updater = useUpdater();
	const derived = useRef(getDerived());

	useEffect(() => {
		const updateMe = () => {
			const current = getDerived();
			if (current !== derived.current) {
				derived.current = current;
				updater();
			}
		};

		return saveDataEffect(getWatched, updateMe);
	}, []);

	return derived.current;
}

export function saveGame() {
	localStorage.setItem("saveGame", JSON.stringify(saveData));
}

export function loadGame() {
	const savedData = localStorage.getItem("saveGame");
	const saveGame = JSON.parse(savedData) || {};
	for (const key of Object.keys(saveGame)) {
		Object.assign(saveData[key], saveGame[key]);
	}

	return savedData != null;
}
