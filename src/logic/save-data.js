const {minionKinds} = require("./minions");
const {upgradeList} = require("./upgrades");

// initial saveData state
const saveData = {
	adventurer1: {
		created: false,
		hp: 0,
		mp: 0,
		exp: 0,
	},
	adventurer2: {
		created: false,
		hp: 0,
		mp: 0,
		exp: 0,
	},
	adventurer3: {
		created: false,
		hp: 0,
		mp: 0,
		exp: 0,
	},
	adventurer4: {
		created: false,
		hp: 0,
		mp: 0,
		exp: 0,
	},
	inventory: {
		money: 0,
	},
	minions: minionKinds.reduce((obj, kind) => {
		obj[kind] = 0;
		return obj;
	}, {}),
	upgrades: upgradeList.reduce((obj, upgrade) => {
		obj[upgrade.id] = false;
		return obj;
	}, {}),
	stats: {
		mostMoney: 0,
		grassClicks: 0,
	},
};

// listener data
const proxyData = {};
const listenerMap = {base: new Set()};
const watch = (listener) => listenerMap.base.add(listener);
watch.off = (listener) => listenerMap.base.delete(listener);

// queued changes
const queue = new Map();
let isSet;
function callListeners() {
	for (const [listeners, value] of queue.entries()) {
		for (const listener of listeners) {
			listener(value);
		}
		queue.delete(listeners);
	}
	isSet = false;
}

// proxy/listener/watch creation
for (const [rootKey, rootObj] of Object.entries(saveData)) {
	const rootData = proxyData[rootKey] = {};
	const rootListenerMap = listenerMap[rootKey] = {};
	const rootListeners = rootListenerMap.base = new Set();
	const rootWatch = watch[rootKey] = (listener) => rootListeners.add(listener);
	rootWatch.off = (listener) => rootListeners.delete(listener);

	// create sub-listeners
	for (const key of Object.keys(rootObj)) {
		const subListeners = rootListenerMap[key] = new Set();
		rootWatch[key] = (listener) => subListeners.add(listener);
		rootWatch[key].off = (listener) => subListeners.delete(listener);

		// create proxy getter/setter pair
		Object.defineProperty(rootData, key, {
			get: () => saveData[rootKey][key],
			set: (prop) => {
				saveData[rootKey][key] = prop;

				queue.set(subListeners, prop);
				queue.set(rootListeners, rootData);
				queue.set(listenerMap.base, proxyData);

				if (!isSet) {
					setTimeout(callListeners, 0);
					isSet = true;
				}
			},
			enumerable: true,
		});
	}
}

module.exports = {
	data: proxyData,
	watch,
	saveGame() {
		localStorage.setItem("saveGame", JSON.stringify(saveData));
	},
	loadGame() {
		const saveGame = localStorage.getItem("saveGame") || {};
		for (const key of Object.keys(saveGame)) {
			Object.assign(saveData[key], saveGame[key]);
		}
	},
};
