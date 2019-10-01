import {game} from "../game";
import {randItem} from "../util";
import {createNewMonster} from "./beings";
import {analyzeWords, createName, slimeWords} from "./name-gen";
import {AI, personalities} from "./ai";

export const encounterStates = {
	playerTurn: "player",
	enemyTurn: "enemy",
	defeat: "defeat",
	victory: "victory",
};

export class Encounter {
	constructor({onVictory, onDefeat}) {
		const enemyName = createName(analyzeWords(slimeWords));
		this.enemy = createNewMonster(enemyName, "slime");
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
			return encounterStates.victory;
		}

		if (game.adventurers.every((a) => a.hp === 0)) {
			return encounterStates.defeat;
		}

		this.turn = (this.turn + 1) % this.turnOrder.length;
		return this.turnOrder[this.turn];
	}
	enemyTurn() {
		const {enemy, ai} = this;

		const action = {source: enemy};
		const decision = ai.decide([], game.adventurers);
		if (decision.action === "skill") {
			const mult = Math.random() < enemy.critChance ? 2 : 1;
			const effect = decision.skill.effect(enemy);
			// TODO: assumes effect is damage
			const damage = effect.amount * mult;
			const dodged = Math.random() < decision.target.critChance;

			enemy.mp -= decision.skill.mpCost(enemy);
			if (!dodged) {
				decision.target.hp -= damage;
			}

			action.target = decision.target;
			action.type = decision.action;
			action.skill = decision.skill;
			action.dodged = dodged;
			action.damage = dodged ? 0 : damage;
		} else if (decision.action === "attack") {
			const mult = Math.random() < enemy.critChance ? 2 : 1;
			const damage = enemy.attack * mult;
			const dodged = Math.random() < decision.target.critChance;

			if (!dodged) {
				decision.target.hp -= damage;
			}

			action.target = decision.target;
			action.type = decision.action;
			action.dodged = dodged;
			action.damage = dodged ? 0 : damage;
		}

		return action;
	}
	playerTurn() {
		const {enemy} = this;

		const player = game.adventurers[0];
		const mult = Math.random() < player.critChance ? 2 : 1;
		const damage = player.attack * mult;
		const dodged = Math.random() < enemy.critChance;

		if (!dodged) {
			enemy.hp -= damage;
		}

		return {
			source: player,
			target: enemy,
			type: "attack",
			dodged,
			damage: dodged ? 0 : damage,
		};
	}
}
