export const directions = {
	left: ({x, y}) => ({x: x - 1, y}),
	right: ({x, y}) => ({x: x + 1, y}),
	up: ({x, y}) => ({x, y: y + 1}),
	down: ({x, y}) => ({x, y: y - 1}),
};

export const inverse = {
	left: "right",
	right: "left",
	up: "down",
	down: "up",
};

class Room {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.left = null;
		this.right = null;
		this.up = null;
		this.down = null;

		this.distance = Infinity;
		this.hasTreasure = false;
		this.hasBoss = false;
		this.visited = false;
	}
}

export class DungeonMap {
	constructor() {
		this.rooms = {};
		this.roomCount = 0;
		this.minX = Infinity;
		this.maxX = -Infinity;
		this.minY = Infinity;
		this.maxY = -Infinity;
	}
	insertNewRoom(x, y) {
		const room = new Room(x, y);

		if (this.rooms[x] == null) {
			this.rooms[x] = {};
		}

		this.rooms[x][y] = room;
		this.roomCount++;

		this.maxX = Math.max(this.maxX, x);
		this.minX = Math.min(this.minX, x);
		this.maxY = Math.max(this.maxY, y);
		this.minY = Math.min(this.minY, y);

		return room;
	}
	getRoom(x, y) {
		if (this.rooms[x] == null) {
			return null;
		}

		return this.rooms[x][y] || null;
	}
	getValidWalls(room) {
		const {minX, maxX, minY, maxY} = this;
		const width = maxX - minX;
		const height = maxY - minY;

		const ratio = width / height;
		const preferX = ratio < .75;
		const preferY = ratio > 1.5;

		return Object.keys(directions).filter((dir) => {
			// already connected to a room
			if (this[dir] != null) {
				return false;
			}

			const {x, y} = directions[dir](room);

			// never place rooms lower than the entrance at (0, 0)
			if (y < 0) {
				return false;
			}

			// current dungeon is too tall, don't make it taller
			if (preferX && y > maxY) {
				return false;
			}

			// current dungeon is too wide, don't make it wider
			if (preferY && (x < minX || x > maxX)) {
				return false;
			}

			// all good, wall is available for connection
			return true;
		});
	}
}
