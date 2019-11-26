export const coinKinds = ["copper", "silver", "gold", "platinum"];

export function parseCoins(amount) {
	const amounts = [Math.floor(amount)];

	for (let i = 1; i < coinKinds.length && amounts[i - 1] >= 1000; i++) {
		amounts[i] = Math.floor(amounts[i - 1] / 1000);
		amounts[i - 1] %= 1000;
	}

	return amounts;
}

const simplifier = /\.?0+$/;
export function parseCoinsShort(amount) {
	const amounts = parseCoins(amount);
	const coinValue = {};
	coinValue.kind = coinKinds[amounts.length - 1];
	coinValue.value = amounts[amounts.length - 1];

	if (amounts.length > 1) {
		coinValue.value += amounts[amounts.length - 2] / 1000;
		coinValue.value = coinValue.value.toFixed(2).replace(simplifier, "");
	} else {
		coinValue.value += amount % 1;
		coinValue.value = coinValue.value.toFixed(1).replace(simplifier, "");
	}

	return coinValue;
}
