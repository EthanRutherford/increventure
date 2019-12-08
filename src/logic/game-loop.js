import {game} from "./game";
import {Encounter} from "./rpg/combat";

function doRandomEncounter() {
	game.encounter = new Encounter({
		onVictory() {
			// temporary, heal the player
			game.adventurers[0].hp = game.adventurers[0].maxHp;
			game.encounter = null;
		},
		onDefeat() {
			// temporary, heal the player
			game.adventurers[0].hp = game.adventurers[0].maxHp;
			game.encounter = null;
		},
	});
}

const tickInterval = 100;

// main logic loop
let lastTick = performance.now();
let lastSave = lastTick;
let lastEncounter = lastTick;
setInterval(function() {
	// timing logic
	const thisTick = performance.now();
	const diff = (thisTick - lastTick) / 1000;
	lastTick = thisTick;

	// update money
	let total = 0;
	for (const rate of game.moneyRates) {
		const amount = rate.amount * diff;
		game.data.stats.minionMoney[rate.kind] += amount;
		total += amount;
	}

	game.data.inventory.money += total;
	game.data.stats.totalMoney += total;

	// stats tracking
	if (game.data.inventory.money > game.data.stats.mostMoney) {
		game.data.stats.mostMoney = game.data.inventory.money;
	}

	// random encounters
	if (window.doRandomEncounters && game.encounter == null) {
		const timeSince = thisTick - lastEncounter;
		const chanceMultiplier = timeSince / (5 * 60 * 1000);
		if (Math.random() * chanceMultiplier > .5) {
			doRandomEncounter();
		}
	} else {
		lastEncounter = thisTick;
	}

	// save game
	if (thisTick - lastSave > 60000) {
		lastSave = thisTick;
		game.save();
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

export const animationSteps = new Set();
