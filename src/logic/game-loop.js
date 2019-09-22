const game = require("./game");
const {minions, minionKinds} = require("./minions");
const {Encounter} = require("./rpg/combat");

function doRandomEncounter() {
	const encounter = new Encounter({
		onVictory() {
			// temporary, heal the player
			game.adventurers[0].hp = game.adventurers[0].maxHp;
			game.setEncounter(null);
		},
		onDefeat() {
			// temporary, heal the player
			game.adventurers[0].hp = game.adventurers[0].maxHp;
			game.setEncounter(null);
		},
	});

	game.setEncounter(encounter);
}

// main logic loop
let lastTick = performance.now();
let lastSave = lastTick;
let lastEncounter = lastTick;
setInterval(function() {
	// timing logic
	const thisTick = performance.now();
	const diff = (thisTick - lastTick) / 1000;
	lastTick = thisTick;

	// minion logic
	for (const kind of minionKinds) {
		if (game.data.minions[kind]) {
			const base = minions[kind].baseRate;
			const count = game.data.minions[kind];
			const mult = game.multipliers[kind];
			game.data.inventory.money += base * count * mult * diff;
		}
	}

	// stats tracking
	if (game.data.inventory.money > game.data.stats.mostMoney) {
		game.data.stats.mostMoney = game.data.money;
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
	if (thisTick - lastSave > 30000) {
		lastSave = thisTick;
		game.save();
	}
}, 50);
