import {Encounter, encounterStates} from "../rpg/combat";
import {randRange} from "../util";
import {generate} from "./generate";
import {lootTreasure} from "./treasure";

export const dungeonDefs = {
	slime: {
		name: "Slime Dungeon",
		level: 1,
		cost: 1000,
	},
	skeleton: {
		name: "Skeleton Dungeon",
		level: 10,
		cost: 10000,
	},
	goblin: {
		name: "Goblin Dungeon",
		cost: 100000,
	},
};

export const dungeonKinds = Object.keys(dungeonDefs);

export class Dungeon {
	constructor(level, end) {
		this.level = level;

		const roomCount = Math.floor(10 * Math.sqrt(level));
		const treasureCount = Math.floor(roomCount * randRange(.2, .5));
		this.map = generate(roomCount, treasureCount);
		this.threatValue = .0625;

		this.curRoom = null;
		this.encounter = null;
		this.visibleRooms = new Set();
		this.goToRoom(this.map.getRoom(0, 0));

		this.end = end;
	}
	goToRoom(room) {
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
			// TODO: implement bosses
			this.encounter = new Encounter((endState) => {
				if (endState === encounterStates.defeat) {
					this.end(false);
				} else {
					this.end(true);
				}
			});
		} else if (Math.random() < this.threatValue) {
			this.threatValue = .0625;
			this.encounter = new Encounter((endState) => {
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
