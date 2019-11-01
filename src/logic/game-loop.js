import {game} from "./game";
import {Encounter} from "./rpg/combat";

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

	// update money
	game.data.inventory.money += game.moneyRate * diff;

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
