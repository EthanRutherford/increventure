import {game} from "../game";
import {actionKinds, doAction} from "./actions";
import {lootEnemy} from "./loot";

export const encounterStates = {
	playerTurn: "player",
	enemyTurn: "enemy",
	defeat: "defeat",
	victory: "victory",
	flee: "flee",
};

function decrementBuffs(being) {
	for (const buff of being.buffs) {
		buff.turns--;
	}
}

function expireBuffs(being) {
	for (const buff of being.buffs) {
		if (buff.turns === 0) {
			being.buffs.delete(buff);
		}
	}
}

export class Encounter {
	constructor(enemy, end) {
		this.enemy = enemy;
		this.turn = 0;
		this.playerFlee = false;
		this.turnOrder = [
			encounterStates.playerTurn,
			encounterStates.enemyTurn,
		];

		this.end = end;
	}
	advanceTurn() {
		if (this.playerFlee) {
			return encounterStates.flee;
		}

		if (this.enemy.hp === 0) {
			for (const adventurer of game.adventurers) {
				adventurer.buffs.clear();
			}

			return encounterStates.victory;
		}

		if (game.adventurers.every((a) => a.hp === 0)) {
			for (const adventurer of game.adventurers) {
				adventurer.buffs.clear();
			}

			return encounterStates.defeat;
		}

		this.turn = (this.turn + 1) % this.turnOrder.length;
		return this.turnOrder[this.turn];
	}
	enemyTurn() {
		decrementBuffs(this.enemy);
		const action = this.enemy.ai.decide([], game.adventurers);
		const result = doAction(this.enemy, action);
		expireBuffs(this.enemy);
		// TODO: handle enemy flee (once support for more than one enemy is added)
		return result;
	}
	playerTurn(action) {
		const player = game.adventurers[0];
		decrementBuffs(player);
		const result = doAction(player, action);
		expireBuffs(player);
		if (action.kind === actionKinds.run && result.values.some((v) => v.success)) {
			this.playerFlee = true;
		}

		return result;
	}
	loot() {
		// TODO: handle multiple enemies
		return lootEnemy(this.enemy);
	}
}
