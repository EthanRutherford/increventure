import {minionKinds} from "./minions";

const upgradeDefs = {
	scissors: {
		name: "Safety Scissors",
		desc: "Cutting grass is easier with something to cut with",
		cost: 100,
		getDeps: (game) => [game.minions.grass.count],
		unlock: (game) => game.minions.grass.count >= 1,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	shears: {
		name: "Garden Shears",
		desc: "Basically these are just really big scissors",
		cost: 1000,
		getDeps: (game) => [game.upgrades.scissors.owned, game.stats.grassClicks],
		unlock: (game) => game.upgrades.scissors.owned && game.stats.grassClicks >= 100,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	scythes: {
		name: "Scythes",
		desc: "Congrats! You've learned to use an actual grass cutting tool!",
		cost: 10000,
		getDeps: (game) => [game.upgrades.shears.owned, game.stats.grassClicks],
		unlock: (game) => game.upgrades.shears.owned && game.stats.grassClicks >= 1000,
		effect: (multipliers) => multipliers.grass *= 2,
	},
	slimeCandy: {
		name: "Slime Candy",
		desc: "It sounds gross, but slimes love this stuff",
		cost: 1000,
		getDeps: (game) => [game.minions.slime.count],
		unlock: (game) => game.minions.slime.count >= 1,
		effect: (multipliers) => multipliers.slime *= 2,
	},
	slimeRancher: {
		name: "Slime Rancher",
		desc: "Your slime will help by disolving grass",
		cost: 2000,
		getDeps: (game) => [game.minions.slime.count],
		unlock: (game) => game.minions.slime.count >= 15,
		effect: (multipliers) => multipliers.clickBonus.slime += .1,
	},
	gotMilk: {
		name: "Got Milk?",
		desc: "Milk makes bones strong!",
		cost: 10000,
		getDeps: (game) => [game.minions.skeleton.count],
		unlock: (game) => game.minions.skeleton.count >= 1,
		effect: (multipliers) => multipliers.skeleton *= 2,
	},
	skeletonMowers: {
		name: "Skeleton lawn mowers",
		desc: "Your skeletons will help cut grass",
		cost: 20000,
		getDeps: (game) => [game.minions.skeleton.count],
		unlock: (game) => game.minions.skeleton.count >= 15,
		effect: (multipliers) => multipliers.clickBonus.skeleton += .1,
	},
	goblinAle: {
		name: "Goblin Ale",
		desc: "Goblins are a little less beligerent when drunk",
		cost: 100000,
		getDeps: (game) => [game.minions.goblin.count],
		unlock: (game) => game.minions.goblin.count >= 1,
		effect: (multipliers) => multipliers.goblin *= 2,
	},
	scorchedEarth: {
		name: "Scorched Earth",
		desc: "Little known fact, goblins hate grass",
		cost: 200000,
		getDeps: (game) => [game.minions.goblin.count],
		unlock: (game) => game.minions.goblin.count >= 15,
		effect: (multipliers) => multipliers.clickBonus.goblin += .1,
	},
};

export const upgradeIds = Object.keys(upgradeDefs);

export function calculateMultipliers(upgrades) {
	const base = minionKinds.reduce((obj, kind) => {
		obj.clickBonus[kind] = 0;
		obj[kind] = 1;
		return obj;
	}, {clickBonus: {}});

	for (const [id, upgrade] of Object.entries(upgrades)) {
		if (upgrade.owned) {
			upgrades[id].effect(base);
		}
	}

	return base;
}

export class Upgrade {
	constructor(id, owned) {
		this.id = id;
		this.owned = owned;

		const def = upgradeDefs[id];
		this.name = def.name;
		this.desc = def.desc;
		this.cost = def.cost;
		this.unlock = def.unlock;
		this.effect = def.effect;
	}
	getDeps(game) {
		const deps = upgradeDefs[this.id].getDeps(game);
		deps.push(this.owned);
		return deps;
	}
}
