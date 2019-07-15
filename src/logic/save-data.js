const {useState, useEffect} = require("react");
const {minionKinds} = require("./minions");
const {upgradeIds} = require("./upgrades");

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
const listenerMap = {"": new Set()};
let timeout;
const queue = new Set();

function getAllListeners(key) {
	const listeners = listenerMap[key] || new Set();

	let index;
	while ((index = key.lastIndexOf(".", index)) !== -1) {
		key = key.substring(0, index);
		for (const listener of listenerMap[key] || []) {
			listeners.add(listener);
		}
	}

	for (const listener of listenerMap[""]) {
		listeners.add(listener);
	}

	return listeners;
}

function doUpdates() {
	for (const update of queue) {
		const listeners = getAllListeners(update);

		for (const listener of listeners) {
			listener();
		}
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
	const keyPath = getWatched == null ? maker : getWatched(maker);
	const paths = (keyPath instanceof Array ? keyPath : [keyPath]).map((x) => x());
	for (const path of paths) {
		if (listenerMap[path] == null) {
			listenerMap[path] = new Set([updateMe]);
		} else {
			listenerMap[path].add(updateMe);
		}
	}

	return () => {
		for (const path of paths) {
			listenerMap[path].delete(updateMe);
		}
	};
}

function useSaveData(getWatched = null) {
	const flipFlop = useState(true);
	useEffect(() => {
		const updateMe = () => flipFlop[1]((x) => !x);
		return saveDataEffect(getWatched, updateMe);
	}, []);
}

module.exports = {
	data: proxify(saveData, "data"),
	useSaveData,
	saveGame() {
		localStorage.setItem("saveGame", JSON.stringify(saveData));
	},
	loadGame() {
		const saveGame = JSON.parse(localStorage.getItem("saveGame")) || {};
		for (const key of Object.keys(saveGame)) {
			Object.assign(saveData[key], saveGame[key]);
		}
	},
};
