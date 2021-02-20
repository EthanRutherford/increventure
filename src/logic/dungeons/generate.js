import {WeightedSet, randItem, popRandItem} from "../util";
import {directions, inverse, DungeonMap} from "./map";

function getWeight(map, room) {
	const walls = map.getValidWalls(room);
	const boost = walls.filter((dir) => {
		const {x, y} = directions[dir](room);
		return map.getRoom(x, y) == null;
	}).length * 5;

	return walls.length > 0 ? 1 + boost : 0;
}

function computeDistances(root) {
	const results = new Map();
	results.set(root, 0);

	const queue = [root];
	while (queue.length > 0) {
		const room = queue.shift();
		const dist = results.get(room);

		const neighbors = [room.up, room.left, room.right, room.down].filter((r) => r != null);
		for (const neighbor of neighbors) {
			const seen = results.has(neighbor);
			const prevDist = seen ? results.get(neighbor) : Infinity;
			results.set(neighbor, Math.min(prevDist, dist + 1));
			if (!seen) {
				queue.push(neighbor);
			}
		}
	}

	return results;
}

export function generate(roomCount, treasureCount) {
	const map = new DungeonMap();
	const root = map.insertNewRoom(0, 0);
	const rooms = [root];

	while (rooms.length < roomCount) {
		const set = new WeightedSet(rooms.map((room) => ({
			item: room,
			weight: getWeight(map, room),
		})));

		const room = set.getRand();
		const walls = map.getValidWalls(room);

		const doorDir = randItem(walls);
		const {x, y} = directions[doorDir](room);

		let neighbor = map.getRoom(x, y);
		if (neighbor == null) {
			neighbor = map.insertNewRoom(x, y);
			rooms.push(neighbor);
		}

		room[doorDir] = neighbor;
		neighbor[inverse[doorDir]] = room;
	}

	// add the boss to the the furthest room from the entrance
	const distances = computeDistances(root);
	const furthestRoom = rooms.reduce((best, cur) => {
		if (distances.get(cur) > distances.get(best)) {
			return cur;
		}

		return best;
	}, root);
	furthestRoom.hasBoss = true;

	while (treasureCount > 0) {
		const roomForTreasure = popRandItem(rooms);

		// don't put treasure in the entrance or boss room
		if (roomForTreasure !== root && !roomForTreasure.hasBoss) {
			roomForTreasure.hasTreasure = true;
			treasureCount--;
		}
	}

	return map;
}
