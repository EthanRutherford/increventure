import {useEffect} from "react";
import {useUpdater} from "../logic/util";

const updaters = new Set();
const toasts = new Set();

export function useToasts() {
	const updater = useUpdater();

	useEffect(() => {
		updaters.add(updater);
		return () => updaters.delete(updater);
	}, []);

	return [...toasts.values()];
}

export function addToast({
	title,
	desc,
	ttl = 5000,
}) {
	const toast = {
		title: title,
		desc: desc,
		killMe() {
			if (toasts.has(toast)) {
				toasts.delete(toast);
				for (const updater of updaters) {
					updater();
				}
			}
		},
	};

	toasts.add(toast);

	if (ttl > 0) {
		setTimeout(toast.killMe, ttl);
	}

	for (const updater of updaters) {
		updater();
	}
}
