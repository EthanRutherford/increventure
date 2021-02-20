import {game} from "./game";

const tickInterval = 100;

// main logic loop
let lastTick = performance.now();
let lastSave = lastTick;
setInterval(function() {
	// timing logic
	const thisTick = performance.now();
	const diff = (thisTick - lastTick) / 1000;
	lastTick = thisTick;

	// update money
	let total = 0;
	for (const rate of game.moneyRates) {
		const amount = rate.amount * diff;
		game.stats.minionMoney[rate.kind] += amount;
		total += amount;
	}

	game.inventory.money += total;
	game.stats.totalMoney += total;

	// stats tracking
	if (game.inventory.money > game.stats.mostMoney) {
		game.stats.mostMoney = game.inventory.money;
	}

	// save game
	if (thisTick - lastSave > 60000) {
		lastSave = thisTick;
		game.save();
	}

	for (const tickStep of tickSteps) {
		tickStep(thisTick, diff);
	}
}, tickInterval);

// animation loop
let lastStep = performance.now();
function step() {
	requestAnimationFrame(step);

	// timing logic
	const thisStep = performance.now();
	const stepDiff = (thisStep - lastStep) / 1000;
	lastStep = thisStep;
	const tickDiff = (thisStep - lastTick) / 1000;

	for (const animationStep of animationSteps) {
		animationStep(thisStep, stepDiff, tickDiff);
	}
}

requestAnimationFrame(step);

export const tickSteps = new Set();
export const animationSteps = new Set();
