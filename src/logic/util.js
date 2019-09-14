const randRange = (min, max) => min + Math.random() * (max - min);
const randInt = (min, max) => Math.floor(randRange(min, max));
const randItem = (list) => list[randInt(0, list.length)];

class WeightedSet {
	constructor() {
		this.items = new Map();
		this.total = 0;
	}
	add(item) {
		this.items.set(item, (this.items.get(item) || 0) + 1);
		this.total++;
	}
	remove(item) {
		const count = this.items.get(item);
		if (count == null) return;

		if (count === 1) {
			this.items.delete(item);
		} else {
			this.items.set(item, count - 1);
		}

		this.total--;
	}
	getRand() {
		const which = randInt(0, this.total);
		let counter = 0;
		for (const [value, weight] of this.items.entries()) {
			counter += weight;
			if (counter >= which) {
				return value;
			}
		}

		throw "this should not happen";
	}
}

function throttle(func, time) {
	let latestArgs = [];
	let lastCall = 0;
	let timeout = null;
	const wrapped = (...args) => {
		latestArgs = args;
		if (timeout) {
			return;
		}

		const now = performance.now();
		const elapsed = now - lastCall;
		if (elapsed >= time) {
			lastCall = now;
			func(...latestArgs);
		} else {
			setTimeout(() => {
				lastCall = performance.now();
				func(...latestArgs);
			});
		}
	};

	wrapped.cancel = () => {
		clearTimeout(timeout);
		timeout = null;
	};

	return wrapped;
}

module.exports = {
	randRange,
	randInt,
	randItem,
	WeightedSet,
	throttle,
};
