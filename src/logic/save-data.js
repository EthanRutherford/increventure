const {minionKinds} = require("./minions");
const {upgradeList} = require("./upgrades");

// initial saveData state
const saveData = {
	adventurer1: {
		created: false,
	},
	adventurer2: {
		created: false,
	},
	adventurer3: {
		created: false,
	},
	adventurer4: {
		created: false,
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

// set up didMount and willUnmount handlers to add/remove bound handler
function connect(component, listener, listeners) {
	const boundListener = listener.bind(component);
	const didMount = component.componentDidMount;
	const willUnmount = component.componentWillUnmount;
	component.componentDidMount = function() {
		listeners.add(boundListener);
		if (didMount) didMount();
	};
	component.componentWillUnmount = function() {
		listeners.delete(boundListener);
		if (willUnmount) willUnmount();
	};
}

// listener data
const listenerMap = {base: new Set()};
const proxyData = {};
const watch = (component, listener) => connect(component, listener, listenerMap.base);

// queued changes
const queue = new Map();
function callListeners() {
	for (const [listeners, value] of queue.entries()) {
		if (listeners) {
			for (const listener of listeners) {
				listener(value);
			}
		}
	}
	queue.clear();
}

// proxy/listener/watch creation
for (const [rootKey, rootObj] of Object.entries(saveData)) {
	const rootListenerMap = listenerMap[rootKey] = {};
	const rootListeners = rootListenerMap.base = new Set();

	proxyData[rootKey] = new Proxy(rootObj, {
		set(target, prop, value) {
			saveData[rootKey][prop] = value;

			queue.set(rootListenerMap[prop], value);
			queue.set(rootListeners, proxyData[rootKey]);
			queue.set(listenerMap.base, proxyData);

			if (queue.size) setTimeout(callListeners, 0);
			return true;
		},
	});

	watch[rootKey] = new Proxy((component, listener) => connect(component, listener, rootListeners), {
		get(target, prop) {
			if (rootListenerMap[prop] == null) rootListenerMap[prop] = new Set();
			return (component, listener) => connect(component, listener, rootListenerMap[prop]);
		},
	});
}

module.exports = {
	data: proxyData,
	watch,
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
