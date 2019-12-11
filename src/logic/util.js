import {useState} from "react";

const invert = (x) => !x;
export function useUpdater() {
	const [, setter] = useState(true);
	return () => setter(invert);
}

export const randRange = (min, max) => min + Math.random() * (max - min);
export const randInt = (min, max) => Math.round(randRange(min, max));
export const randItem = (list) => list[randInt(0, list.length - 1)];

export class WeightedSet {
	constructor(items = []) {
		this.items = new Map();
		this.total = 0;

		for (const item of items) {
			if (item.item && item.weight) {
				this.set(item.item, item.weight);
			} else {
				this.add(item);
			}
		}
	}
	add(item) {
		const count = this.items.get(item) || 0;
		this.items.set(item, count + 1);
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
	set(item, count) {
		const oldCount = this.items.get(item) || 0;
		const newCount = Math.max(count, 0);
		if (newCount === 0) {
			this.items.delete(item);
		} else {
			this.items.set(item, newCount);
		}

		this.total += newCount - oldCount;
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
	getFilteredRand(filter) {
		const filtered = [];
		let subTotal = 0;
		for (const [value, weight] of this.items.entries()) {
			if (filter(value)) {
				filtered.push([value, weight]);
				subTotal += weight;
			}
		}

		const which = randInt(0, subTotal);
		let counter = 0;
		for (const [value, weight] of filtered) {
			counter += weight;
			if (counter >= which) {
				return value;
			}
		}

		return null;
	}
}
