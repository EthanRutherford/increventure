export const randRange = (min, max) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.floor(randRange(min, max));
export const randItem = (list) => list[randInt(0, list.length)];

export class WeightedSet {
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

export function throttle(func, time) {
	const context = {
		latestArgs: [],
		lastCall: 0,
		timeout: null,
	};
	const invoke = () => {
		context.lastCall = performance.now();
		func(...context.latestArgs);
	};

	const wrapped = (...args) => {
		context.latestArgs = args;
		if (context.timeout) {
			return;
		}

		const elapsed = performance.now() - context.lastCall;
		if (elapsed >= time) {
			invoke();
		} else {
			setTimeout(invoke, time - elapsed);
		}
	};

	wrapped.cancel = () => {
		clearTimeout(context.timeout);
		context.timeout = null;
	};

	return wrapped;
}
