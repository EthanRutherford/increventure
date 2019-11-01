import {useState, useEffect} from "react";

const invert = (x) => !x;

export function createGameHook(game, name, value) {
	const setters = new Set();

	Object.defineProperty(game, name, {
		get() {
			return value;
		},
		set(v) {
			value = v;
			for (const setter of setters) {
				setter(invert);
			}
		},
	});

	return () => {
		const [, setter] = useState(false);
		useEffect(() => {
			setters.add(setter);
			return () => setters.delete(setter);
		}, []);
	};
}
