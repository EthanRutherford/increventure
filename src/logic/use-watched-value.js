import {useState, useEffect} from "react";
import {animationSteps, tickSteps} from "./game-loop";

export function useWatchedValue(getValue, getDeps, animated = false) {
	const [value, setValue] = useState(() => getValue(0, 0, 0));

	useEffect(() => {
		let currentDeps = getDeps && getDeps();
		let currentValue = value;

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

			setValue(getValue(...args));
		}

		function noDepsUpdate(...args) {
			const prevValue = currentValue;
			currentValue = getValue(...args);
			if (prevValue !== currentValue) {
				setValue(currentValue);
			}
		}

		const updateSteps = animated ? animationSteps : tickSteps;
		const update = getDeps != null ? depsUpdate : noDepsUpdate;

		updateSteps.add(update);
		return () => updateSteps.delete(update);
	}, []);

	return value;
}
