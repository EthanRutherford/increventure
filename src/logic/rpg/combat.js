const game = require("../game");
const {randItem} = require("../util");
const {createNewMonster} = require("./beings");
const {analyzeWords, createName, slimeWords} = require("./name-gen");
const {AI, personalities} = require("./ai");

class Encounter {
	constructor() {
		const enemyName = createName(analyzeWords(slimeWords));
		this.enemy = createNewMonster(enemyName, "slime");
		this.ai = new AI(this.enemy, randItem([...Object.values(personalities)]));
		this.turnOrder = [
			"player",
			"enemy",
		];
		this.turn = 0;

		// temporary, heal the player
		game.adventurers[0].hp = game.adventurers[0].maxHp;
	}
	advanceTurn() {
		this.turn = (this.turn + 1) % this.turnOrder.length;
		return this.turnOrder[this.turn];
	}
	enemyTurn() {
		const {enemy, ai} = this;

		const decision = ai.decide([], game.adventurers);
		if (decision.action === "skill") {
			const mult = Math.random() < enemy.critChance ? 2 : 1;
			const effect = decision.skill.effect(enemy);
			const damage = effect.amount * mult;

			enemy.mp -= decision.skill.mpCost(enemy);

			if (Math.random() < decision.target.critChance) {
				return `${enemy.name} used ${decision.skill.name}, but ${decision.target.name} dodged the attack!`;
			}

			decision.target.hp -= damage;

			return `${enemy.name} uses ${decision.skill.name} on ${decision.target.name} for ${damage} damage!`;
		} else if (decision.action === "attack") {
			const mult = Math.random() < enemy.critChance ? 2 : 1;
			const damage = enemy.attack * mult;

			if (Math.random() < decision.target.critChance) {
				return `${enemy.name} attacks, but ${decision.target.name} dodged the attack!`;
			}

			decision.target.hp -= damage;

			return `${enemy.name} attacks ${decision.target.name} for ${damage} damage!`;
		}

		return `${enemy.name} is pretty gross.`;
	}
	playerTurn() {
		const {enemy} = this;

		const player = game.adventurers[0];
		const mult = Math.random() < player.critChance ? 2 : 1;
		const damage = player.attack * mult;

		if (Math.random() < enemy.critChance) {
			return `${player.name} attacks, but ${enemy.name} dodged the attack!`;
		}

		enemy.hp -= damage;

		return `${player.name} attacks ${enemy.name} for ${damage} damage!`;
	}
}

module.exports = Encounter;
