import {levelToXp} from "../rpg/beings";
import {Encounter, encounterStates} from "../rpg/combat";
import {createNewMonster} from "../rpg/beings";
import {AI, personalities} from "../rpg/ai";
import {randItem, randRange} from "../util";
import {generate} from "./generate";
import {lootTreasure} from "./treasure";

export const dungeonDefs = {
	slime: {
		name: "Slime Dungeon",
		level: 1,
		cost: 500,
		enemyKinds: ["slime"],
		bossKind: "slimeKing",
	},
	skeleton: {
		name: "Skeleton Dungeon",
		level: 5,
		cost: 5000,
		enemyKinds: ["skeleton"],
		bossKind: "skeleton", // TODO: actual boss pls
	},
	goblin: {
		name: "Goblin Dungeon",
		level: 10,
		cost: 50000,
	},
};

export const dungeonKinds = Object.keys(dungeonDefs);

export class Dungeon {
	constructor(def, end) {
		this.level = def.level;
		this.enemyXp = levelToXp(this.level);
		this.enemyKinds = def.enemyKinds;

		const roomCount = Math.floor(10 * Math.sqrt(this.level));
		const treasureCount = Math.floor(roomCount * randRange(.2, .5));
		this.map = generate(roomCount, treasureCount);
		this.threatValue = .0625;

		const bossXp = this.enemyXp * randRange(8, 10);
		this.boss = createNewMonster(def.bossKind, bossXp, {herb: 1});
		this.boss.ai = new AI(this.boss, randItem([...Object.values(personalities)]));

		this.curRoom = null;
		this.encounter = null;
		this.visibleRooms = new Set();
		this.goToRoom(this.map.getRoom(0, 0));

		this.end = end;
	}
	goToRoom(room) {
		const prevRoom = this.curRoom;
		this.curRoom = room;
		this.curRoom.visited = true;
		const roomsToAdd = [room, room.left, room.right, room.up, room.down].filter(
			(room) => room != null,
		);

		for (const room of roomsToAdd) {
			this.visibleRooms.add(room);
		}

		// no encounters in the entrance
		if (room.x === 0 && room.y === 0) {
			return;
		}

		if (room.hasBoss) {
			this.encounter = new Encounter(this.boss, (endState) => {
				if (endState === encounterStates.defeat) {
					this.end(false);
				} else if (endState === encounterStates.victory) {
					this.end(true);
				} else {
					this.curRoom = prevRoom;
					this.encounter = null;
					this.boss.hp = this.boss.maxHp;
					this.boss.mp = this.boss.maxMp;
				}
			});
		} else if (Math.random() < this.threatValue) {
			this.threatValue = .0625;

			const enemyKind = randItem(this.enemyKinds);
			const xp = this.enemyXp * randRange(.9, 1.2);
			const enemy = createNewMonster(enemyKind, xp, {herb: 1});
			enemy.ai = new AI(this.enemy, randItem([...Object.values(personalities)]));
			this.encounter = new Encounter(enemy, (endState) => {
				if (endState === encounterStates.defeat) {
					this.end(false);
				} else {
					this.encounter = null;
				}
			});
		} else {
			this.threatValue *= 2;
		}
	}
	getTreasure(room) {
		if (!room.hasTreasure) {
			return null;
		}

		// treasure-chest treasures are a little better than enemy loot
		room.hasTreasure = false;
		return lootTreasure(this.level * 5);
	}
}
