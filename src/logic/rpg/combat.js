import {game} from "../game";
import {randItem} from "../util";
import {createNewMonster} from "./beings";
import {analyzeWords, createName, slimeWords} from "./name-gen";
import {AI, personalities} from "./ai";
import {doAction} from "./actions";

export const encounterStates = {
	playerTurn: "player",
	enemyTurn: "enemy",
	defeat: "defeat",
	victory: "victory",
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
	constructor({onVictory, onDefeat}) {
		const enemyName = createName(analyzeWords(slimeWords));
		this.enemy = createNewMonster(enemyName, "slime", {herb: 1});
		this.ai = new AI(this.enemy, randItem([...Object.values(personalities)]));
		this.turn = 0;
		this.turnOrder = [
			encounterStates.playerTurn,
			encounterStates.enemyTurn,
		];

		this.onVictory = onVictory;
		this.onDefeat = onDefeat;
	}
	advanceTurn() {
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
		const {enemy, ai} = this;
		decrementBuffs(enemy);
		const action = ai.decide([], game.adventurers);
		const result = doAction(enemy, action);
		expireBuffs(enemy);
		return result;
	}
	playerTurn(action) {
		const player = game.adventurers[0];
		decrementBuffs(player);
		const result = doAction(player, action);
		expireBuffs(player);
		return result;
	}
}
