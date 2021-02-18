import {useRef, useEffect} from "react";
import {animationSteps, tickSteps} from "./game-loop";
import {useUpdater} from "./util";

export function useWatchedValue(getValue, getDeps, animated = false) {
	const firstRender = useRef(true);
	const value = useRef();
	const updater = useUpdater();

	if (firstRender.current) {
		firstRender.current = false;
		value.current = getValue(0, 0, 0);
	}

	useEffect(() => {
		let currentDeps = getDeps && getDeps();

		function getDepsChanged() {
			const prevDeps = currentDeps;
			currentDeps = getDeps();
			if (prevDeps.length !== currentDeps.length) {
				return true;
			}

			for (let i = 0; i < currentDeps.length; i++) {
				if (currentDeps[i] !== prevDeps[i]) {
					return true;
				}
			}

			return false;
		}

		function depsUpdate(...args) {
			if (!getDepsChanged()) {
				return;
			}

			value.current = getValue(...args);
			updater();
		}

		function noDepsUpdate(...args) {
			const prevValue = value.current;
			value.current = getValue(...args);
			if (prevValue !== value.current) {
				updater();
			}
		}

		const updateSteps = animated ? animationSteps : tickSteps;
		const update = getDeps != null ? depsUpdate : noDepsUpdate;

		updateSteps.add(update);
		return () => updateSteps.delete(update);
	}, []);

	return value.current;
}
