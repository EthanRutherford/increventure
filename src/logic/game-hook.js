import {useEffect} from "react";
import {useUpdater} from "./util";

export function createGameHook(game, name, value) {
	const updaters = new Set();

	Object.defineProperty(game, name, {
		get() {
			return value;
		},
		set(v) {
			value = v;
			for (const updater of updaters) {
				updater();
			}
		},
	});

	return () => {
		const updater = useUpdater();
		useEffect(() => {
			updaters.add(updater);
			return () => updaters.delete(updater);
		}, []);
	};
}
