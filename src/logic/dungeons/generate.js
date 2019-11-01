import {WeightedSet, randItem} from "../util";
import {directions, inverse, Map} from "./map";

function getWeight(map, room) {
	const walls = map.getValidWalls(room);
	const boost = walls.filter((dir) => {
		const {x, y} = directions[dir](room);
		return map.getRoom(x, y) == null;
	}).length * 5;

	return walls.length > 0 ? 1 + boost : 0;
}

export function generate(roomCount) {
	const map = new Map();
	const root = map.insertNewRoom(0, 0);
	const rooms = [root];

	while (rooms.length < roomCount) {
		const set = new WeightedSet();
		for (const room of rooms) {
			set.set(room, getWeight(map, room));
		}

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

	return map;
}
